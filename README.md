# pico-archive

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

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


### Stuff

Get username: this.$store.getters.getUser.displayName

### Firebase Deployment

This site has two firebase instances, dev and prod. To switch between the two:

1. Make sure that the correct config is uncommented in main.js
2. Set the correct deploy path with `firebase use`:
- `firebase use default` for production
- `firebase use dev` for dev
