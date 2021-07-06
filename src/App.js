import './App.css';
import {BrowserRouter as Router, Route, Switch, Link} from "react-router-dom";
import Home from "./Home";
import {Drawer, IconButton, ListItem} from "@material-ui/core";
import AppBar from '@material-ui/core/AppBar';
import MenuIcon from "@material-ui/icons/Menu";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import {useState} from "react";
import HymnPage from "./HymnPage";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

const useStyles = makeStyles((theme) => ({
    appBar: {
      display: "flex"
    }, appBarDiv: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      //...theme.mixins.toolbar,
      justifyContent: 'flex-end',
    },
    drawerContainer:{
      minWidth:"300px"
    }
  })
)

function ListItemLink(props) {
  return <ListItem button component={Link} {...props} />;
}


function App() {
  const classes = useStyles()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const openDrawer = () => {
    setDrawerOpen(true)
  }
  const closeDrawer = () => {
    setDrawerOpen(false)
  }


  return (
    <Router>
      <div>
        <div className={classes.appBarDiv}>
          <AppBar position={"static"} className={classes.appBar}>
            <Toolbar>

              <IconButton edge="start" color="inherit" aria-label="menu" onClick={openDrawer}>
                <MenuIcon/>
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                Hymn Music Sheet
              </Typography>
            </Toolbar>
          </AppBar>
        </div>
        <Drawer anchor={"left"} open={drawerOpen} onClose={closeDrawer}>
          <div className={classes.drawerContainer}>
            <div className={classes.drawerHeader}>
              <IconButton onClick={closeDrawer}>
                <ChevronLeftIcon/>
              </IconButton>
            </div>
            <Divider />
            <List>
              <ListItemLink to="/">
                <ListItemText primary="Home" />
              </ListItemLink>
              <ListItemLink to="/hymn">
                <ListItemText primary="Hymn" />
              </ListItemLink>
            </List>
          </div>
        </Drawer>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/hymn">
            <HymnPage/>
          </Route>
          <Route path="/">
            <Home/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
