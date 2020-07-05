const { readFileSync } = require('fs')
const { exec } = require('child_process')
const polka = require('polka')
const port = process.env.PORT || 3000

polka()
  .get('/', (req, res) => { // send example app html
    res.end(readFileSync('./example.html', 'utf-8'))
  })
  .post('/', (req,res) => { // api app
    res.writeHead(200, {
      'Content-Type': 'application/json'
    })

    /**
     * execute termux command (termux-sms-send)
     *
     * ref https://wiki.termux.com/wiki/Termux-sms-send
     */
    exec(`termux-sms-send -n ${req.query.number} ${req.query.body}`, (error, stdout, stderr) => {
      res.end(JSON.stringify({ // send response data
        status: !(error || stderr) // check command status
      }))
    })
  })
  .listen(port, err => {
    if (err) throw err
    console.log(`App run on port ${port}`)
  })