// @flow

import React from "react"
import CssBaseline from "@material-ui/core/CssBaseline"
import blueGrey from "@material-ui/core/colors/blueGrey"
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import { SnackbarProvider } from "notistack"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"

import { HTML5Backend } from "react-dnd-html5-backend"
import { DndProvider } from "react-dnd"

import Router from "../config/router"
import { WebsocketHandler } from "../config/websocket"

import StorageContext from "../shared/storageContext"
import BrowserStorage from "../shared/storage/browserStorage"
import UserStorage from "../shared/storage/userStorage"
import FilterStorage from "../shared/storage/filterStorage"

import UserModel from "../shared/models/user"
import FilterModel from "../shared/models/filter"

import UserContext from "../components/utils/userContext"
import FilterContext from "../components/utils/filterContext"

import BackendContext from "../shared/backendContext"

import ApiBackend from "../shared/backend/backends/apiBackend"

import ServiceWorker from "../config/serviceWorker"

import "./main.css"

const theme = createMuiTheme({
  palette: {
    primary: blueGrey,
    secondary: {
      main: "#f44336"
    }
  }
})

const key =
  process.env.NODE_ENV === "production"
    ? "pk_live_wckW32WrC7uGWJUuLpU8AJ1k"
    : "pk_test_fVIfLmG59tZ59sEKYuLqCCFM"

const stripePromise = loadStripe(key)

window.socket = new WebsocketHandler()

const storage = new BrowserStorage()
const backend = new ApiBackend()
const userStorage = new UserStorage(storage)
const filterStorage = new FilterStorage(storage)

const Index = () => {
  const [user, setUser] = React.useState(userStorage.loadUser())
  const [filter, setFilter] = React.useState(filterStorage.loadFilter())

  const setUserWithStorage = (u: ?UserModel) => {
    if (!u) {
      userStorage.logoutUser()
      setUser(null)
      return
    }
    setUser(new UserModel(u))
    userStorage.saveUser(u)
  }

  const setFilterWithStorage = (f: ?FilterModel) => {
    if (!f) {
      setFilter(null)
      return
    }
    setFilter(new FilterModel(f))
    filterStorage.saveFilter(f)
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <BackendContext.Provider value={backend}>
        <StorageContext.Provider value={storage}>
          <UserContext.Provider value={{ user, setUser: setUserWithStorage }}>
            <FilterContext.Provider
              value={{ filter, setFilter: setFilterWithStorage }}
            >
              <Elements stripe={stripePromise}>
                <CssBaseline />
                <SnackbarProvider
                  maxSnack={1}
                  preventDuplicate
                  anchorOrigin={{ vertical: "top", horizontal: "left" }}
                >
                  <MuiThemeProvider theme={theme}>
                    <Router user={user} />
                    <ServiceWorker />
                  </MuiThemeProvider>
                </SnackbarProvider>
              </Elements>
            </FilterContext.Provider>
          </UserContext.Provider>
        </StorageContext.Provider>
      </BackendContext.Provider>
    </DndProvider>
  )
}

export default Index
