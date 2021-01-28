const URL = "https://twitter-clone-ok.herokuapp.com/";


let nextPageUrl = null ;

const onEnter = (e) => {

    if(e.key == "Enter") {
        getTwitterData();
    }

}
const onNext = () => {
    if(nextPageUrl) {
        getTwitterData(true);
    }
}
/**
 * Retrive Twitter Data from API
 */
const getTwitterData = (nextPagee=false) => {
    const query = document.getElementById("input-search-tweets").value;

    if(!query) return;

    const enCodedQuery = encodeURIComponent(query);
        
    let fullUrl = `${URL}tweets?q=${enCodedQuery}&count=10`;
      if (nextPagee && nextPageUrl) {
          fullUrl = nextPageUrl
      }
     fetch(fullUrl).then((response) => {
         console.log(response)
           if(response.ok) {
            return response.json();
           }
           
      }).then((data) => {
          console.log("Data>>>", data)
           buildTweets(data.statuses, nextPagee);
           saveNextPage(data.search_metadata);
           nextPageButtonVisibility(data.search_metadata);
      })
}
getTwitterData();
/**
 * Save the next page data
 */
const saveNextPage = (metadata) => {
    if(metadata.next_results) {

     nextPageUrl = `${URL}${metadata.next_results}`;
    } else {
        nextPageUrl = null;
    }
}

/**
 * Handle when a user clicks on a trend
 */
const selectTrend = (e) => {
    
    const text = e.innerText;
    document.getElementById('input-search-tweets').value = text;
    getTwitterData();

}

/**
 * Set the visibility of next page based on if there is data on next page
 */
const nextPageButtonVisibility = (metadata) => {
    if(metadata.next_results) {
        document.getElementById('next-page').style.visibility = 'visible';
    }else {

        document.getElementById('next-page').style.visibility = 'hidden';

    }
}

/**
 * Build Tweets HTML based on Data from API
 */
const buildTweets = (tweets, nextPagee) => {

   

    let twitterContent = "" ;
    tweets.map((tweet) => {
        const createdDate = moment(tweet.created_at).fromNow()
        twitterContent += `

        <div class="twittes">
        <div class="tweitters-user-info">
            <div class="twitter-user-profile" style="background-image: url(${tweet.user.profile_image_url_https})">

            </div>
            <div class="twitter-user-name-container">
                <div class="twitter-user-fullname">
                      ${tweet.user.name}


                </div>
                <div class="twitter-user-username">@${tweet.user.screen_name}</div>
            </div>
        </div>
        `
        if(tweet.extended_entities &&
            tweet.extended_entities.media.length > 0) {
             twitterContent +=  buildImages(tweet.extended_entities.media)
             twitterContent +=  buildVideo(tweet.extended_entities.media)

        }

       

        twitterContent += `

        <div class="caption-container">
          ${tweet.text}
        </div>

        <div class="date-container">
           ${createdDate}
        </div>
      </div>
        
        
        `
    })

    if(nextPagee) {
        document.querySelector('.twittes-list').insertAdjacentHTML('beforeend' , twitterContent)
    }else {
        document.querySelector('.twittes-list').innerHTML = twitterContent;

    }

   

}

/**
 * Build HTML for Tweets Images
 */
const buildImages = (mediaList) => {
    let imagesContent = `<div class="image-container">`;
    let imageExist = false ;
    mediaList.map((media) => {
        if(media.type == 'photo') {
            imageExist = true;
            imagesContent += `<div class="image-single" style="background-image: url(${media.media_url_https})"></div>`
        }
    });
    imagesContent += `</div>`
    return imageExist ? imagesContent : '' ;

}

/**
 * Build HTML for Tweets Video
 */
const buildVideo = (mediaList) => {

    let videoContent = `<div class="video-container">`;
    let videoExist = false ;
    mediaList.map((media) => {
        if(media.type == 'video') {
                 videoExist = true;
                 const videoVarient = media.video_info.variants.find((variant) => variant.content_type == 'video/mp4');
            videoContent += `
            <video controls>
              <source src="${videoVarient.url}" type="video/mp4">
            
          
            </video>
            
            `
        }else if (media.type == 'animated_gif') {

            videoExist = true;
            const videoVarient = media.video_info.variants.find((variant) => variant.content_type == 'video/mp4');

            videoContent += `
            <video loop autoplay>
              <source src="${videoVarient.url}" type="video/mp4">
            
          
            </video>
            
            `

        }
    });
    videoContent += `</div>`
    return videoExist ? videoContent : '' ;



}
