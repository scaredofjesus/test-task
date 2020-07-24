# test-task

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

A couple of things I should mention though:

1. Filter functionality in each table now only filters through already received and rendered items. Ideally, and if the API allows it, I would prefer to send a request with a filtering query and get a proper filtered response from a server. That way the user can see more results without needing to scroll down and load more. Coincap API also provides multiple parameters for searching, which makes it inconvenient for front-end in case we only want to use one search input instead of adding one to each column.

2. I would prefer to use something more powerful for charts, like Tradeview, but in this case, I went with Highcharts, cause it was faster to set up. The data structure is the same in both of them, so it shouldn't be much different/difficult to set up the other one. Also since it was my first time working with the OHLC chart, so I got a bit confused with the Coincap API `interval` parameter. I wasn't sure if it's supposed to mean `from` `to` kind of thing, or something else. Nevertheless, I added a select input for switching it.

3. If I had more time I would probably do something more sophisticated with WebSocket real-time update functionality, especially flashing the rows that have been updated. Also, I wasn't sure if that part was even needed :).

4. I would also prefer to create a separate component for rendering table lists like that. However, the only way to customize the output in the Vuetify table component is through slots, which would've made said component to bloated. That is why I went with a mixin instead.

PS: Also I replicated coincap.io Exchanges and Charts page, because I wasn't sure if all of the markets needed to be displayed on a separate page, or just exchange specific like it's done on coincap.io. If I didn't understand the task properly and something else needs to be added I will happily do so.
