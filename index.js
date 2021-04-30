const app = require('express')()

const PORT = 8000

const redis = require('redis')
const client = redis.createClient()

client.on("error", (error) => {
    console.error(error)
})

app.get('/', (req, res) => {
    client.get("foo", redis.print)
    res.send("OK")
})

app.get('/set', (req, res) => {
    client.set("foo", req.query.value, redis.print)
    res.send("OK")
})

app.listen(PORT, () => {console.log(`Server running on port ${PORT}`)})