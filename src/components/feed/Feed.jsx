import React, { useEffect, useState } from 'react';
import './feed.css';
import { Link } from 'react-router-dom';
import { API_KEY, value_converter } from '../../data';
import moment from 'moment';

const Feed = ({ category }) => {

  const [data, setData] = useState([]);

  const fetchData = async () => {

    try {

      const videoList_url =
        `https://youtube.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&chart=mostPopular&maxResults=50&regionCode=US&videoCategoryId=${category}&key=${API_KEY}`;

      const response = await fetch(videoList_url);

      const result = await response.json();

      console.log(result);

      // Filter videos having valid thumbnails
      const validVideos = (result.items || []).filter(
        (item) =>
          item?.snippet?.thumbnails?.high?.url
      );

      setData(validVideos);

    } catch (error) {

      console.log("Fetch Error:", error);

    }
  };

  useEffect(() => {
    fetchData();
  }, [category]);

  return (

    <div className="feed">

      {data.map((item) => {

        return (

          <Link
            key={item.id}
            to={`/video/${item.snippet.categoryId}/${item.id}`}
            className='card'
          >

            <img
              src={item.snippet.thumbnails.high.url}
              alt={item.snippet.title}

              onError={(e) => {

                // fallback image if thumbnail fails
                e.target.src =
                  "https://via.placeholder.com/320x180?text=No+Thumbnail";

              }}
            />

            <h2>{item.snippet.title}</h2>

            <h3>{item.snippet.channelTitle}</h3>

            <p>
              {value_converter(item.statistics?.viewCount || 0)}
              views • {moment(item.snippet.publishedAt).fromNow()}
            </p>

          </Link>

        );

      })}

    </div>

  );
};

export default Feed;