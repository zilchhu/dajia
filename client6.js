import SockJS from 'sockjs-client'

var sock = new SockJS('http://192.168.3.3:9999/tests_sync')

sock.onopen = function() {
  console.log('open')
  setTimeout(() => sock.send('10085676'), 3000)
}

sock.onmessage = function(e) {
  console.log('message', e.data)
}

sock.onclose = function() {
  console.log('close')
}
