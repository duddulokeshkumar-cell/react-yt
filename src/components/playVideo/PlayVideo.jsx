import React, { useEffect, useState } from 'react'
import './playvideo.css'
import { useParams } from 'react-router-dom'
import like from '../../assets/like.png'
import dislike from '../../assets/dislike.png'
import share from '../../assets/share.png'
import save from '../../assets/save.png'
import user_profile from '../../assets/user_profile.jpg'

import { value_converter } from '../../data'
import moment from 'moment'

const PlayVideo = () => {

    const {videoId} = useParams();
    const [apiData, setApiData] = useState(null)
    const [channelData, setChannelData] = useState(null)
    const [commentData, setCommentData] = useState([])

    const fetchVideoData = async () => {
        try {

            const res = await fetch(`/api/videos/${videoId}`)
            const data = await res.json()

            console.log("VIDEO DATA:", data)

            if (data.items && data.items.length > 0) {
                setApiData(data.items[0])
            }

        } catch (error) {
            console.log("Error fetching video data:", error)
        }
    }

    const fetchChannelData = async (channelId) => {
        try {

            const res = await fetch(`/api/channels/${channelId}`)
            const data = await res.json()

            console.log("CHANNEL DATA:", data)

            if (data.items && data.items.length > 0) {
                setChannelData(data.items[0])
            }

        } catch (error) {
            console.log("Error fetching channel data:", error)
        }
    }

    const fetchCommentData = async () => {
        try {

            const res = await fetch(`/api/comments/${videoId}`)
            const data = await res.json()

            console.log("COMMENT DATA:", data)

            if (data.items) {
                setCommentData(data.items)
            }

        } catch (error) {
            console.log("Error fetching comments:", error)
        }
    }

    useEffect(() => {
        fetchVideoData()
        fetchCommentData()
    }, [videoId])

    useEffect(() => {

        if (apiData?.snippet?.channelId) {
            fetchChannelData(apiData.snippet.channelId)
        }

    }, [apiData])

    return (
        <div className='play-video'>

            <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>

            <h3>
                {apiData?.snippet?.title || "Loading..."}
            </h3>

            <div className="play-video-info">

                <p>
                    {apiData
                        ? value_converter(apiData.statistics.viewCount)
                        : 0} Views •{" "}

                    {apiData?.snippet?.publishedAt
                        ? moment(apiData.snippet.publishedAt).fromNow()
                        : ""}
                </p>

                <div>

                    <span>
                        <img src={like} alt="" />
                        {apiData
                            ? value_converter(apiData.statistics.likeCount)
                            : 0}
                    </span>

                    <span>
                        <img src={dislike} alt="" /> 5
                    </span>

                    <span>
                        <img src={share} alt="" /> Share
                    </span>

                    <span>
                        <img src={save} alt="" /> Save
                    </span>

                </div>
            </div>

            <hr />

            <div className="publisher">

                <img
                    src={
                        channelData?.snippet?.thumbnails?.default?.url
                        || user_profile
                    }
                    alt=""
                />

                <div>

                    <p>
                        {channelData?.snippet?.title || "Channel"}
                    </p>

                    <span>
                        {channelData?.statistics?.subscriberCount
                            ? value_converter(
                                channelData.statistics.subscriberCount
                              )
                            : "0"} Subscribers
                    </span>

                </div>

                <button>Subscribe</button>

            </div>

            <div className="vid-description">

                <p>
                    {apiData?.snippet?.description
                        ? apiData.snippet.description.slice(0, 250)
                        : "Description"}
                </p>

                <hr />

                <h4>
                    {apiData?.statistics?.commentCount || 0} Comments
                </h4>

                {commentData.map((item, index) => {

                    const comment =
                        item?.snippet?.topLevelComment?.snippet

                    return (

                        <div
                            key={index}
                            className="comment"
                        >

                            <img
                                src={
                                    comment?.authorProfileImageUrl
                                    || user_profile
                                }
                                alt=""
                            />

                            <div>

                                <h3>
                                    {comment?.authorDisplayName}

                                    <span>
                                        {" "}
                                        {comment?.publishedAt
                                            ? moment(comment.publishedAt).fromNow()
                                            : ""}
                                    </span>
                                </h3>

                                <p>
                                    {comment?.textDisplay}
                                </p>

                                <div className="comment-action">

                                    <img src={like} alt="" />

                                    <span>
                                        {comment?.likeCount || 0}
                                    </span>

                                    <img src={dislike} alt="" />

                                </div>

                            </div>

                        </div>
                    )
                })}

            </div>

        </div>
    )
}

export default PlayVideo