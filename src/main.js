import { createApp } from 'vue'
import App from './App.vue'

import 'bootstrap/dist/css/bootstrap.min.css'
import * as boostrap from 'bootstrap'
window.bootstrap = boostrap

import 'codemirror/lib/codemirror.css'
import * as codemirror from 'codemirror/lib/codemirror'
window.codemirror = codemirror

require('codemirror/addon/display/placeholder')

createApp(App).mount('#app')
