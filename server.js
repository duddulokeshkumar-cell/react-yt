import express from 'express'
import cors from 'cors'
import fetch from 'node-fetch'

const app = express()

app.use(cors())

const API_KEY = 'AIzaSyBp3OZRX1f6H8IvFx8MP_PsS5s7CXKU8mg'

app.get('/api/videos/:id', async (req, res) => {

    const videoId = req.params.id

    const url =
        `https://youtube.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${API_KEY}`

    const response = await fetch(url)
    const data = await response.json()
    console.log(data)
    res.json(data)
})

app.get('/api/channels/:id', async (req, res) => {

    const channelId = req.params.id

    const url =
        `https://youtube.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&id=${channelId}&key=${API_KEY}`

    const response = await fetch(url)
    const data = await response.json()
    console.log(data)
    res.json(data)
})

app.get('/api/comments/:id', async (req, res) => {

    const videoId = req.params.id

    const url =
        `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${API_KEY}`

    const response = await fetch(url)
    const data = await response.json()
    console.log(data)
    res.json(data)
})

app.listen(5000, () => {
    console.log("Server running on port 5000")
})