
import axios from "axios";
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css"

const gallery = document.querySelector('.gallery')
const btnEl = document.querySelector('.load-more')
const formEl = document.querySelector('.search-form')

const lightbox = new SimpleLightbox('.gallery a', { captionsData: 'alt', captionDelay: '250' });

btnEl.hidden = true

formEl.addEventListener('submit', onSubmit)
btnEl.addEventListener('click', onLoad)

let iD = ''
let page = 1
let totalPhoto = 0

async function onSubmit  (evt) {
  evt.preventDefault() 
  gallery.innerHTML = ''
  iD = evt.currentTarget[0].value
   try {
    await fetchPhoto(iD)
      .then((array) => {
        if (array.length === 0) {
          Notiflix.Notify.info("Sorry, there are no images matching your search query. Please try again.")
        } else {
          Notiflix.Notify.info(`Hooray! We found ${totalPhoto} images.`) 
          gallery.insertAdjacentHTML('beforeend', createMarkup(array))
          lightbox.refresh()
          btnEl.hidden = false
        }
      })
    } catch (error) {
          console.log(error.message)
  }
}
  

async function onLoad(evt) {
  try {
    page += 1
    if (totalPhoto >= page * 40) {
      await fetchPhoto(iD, page)
        .then((array) => {
          gallery.insertAdjacentHTML('beforeend', createMarkup(array))
          lightbox.refresh()
          smoothScrolling()
        })
    } else {
      btnEl.hidden = true
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.")
    }
  } catch (error) {
        console.log(error.message)}
  }

  
async function fetchPhoto(id, num = 1) {
       const { data } = await axios.get(`https://pixabay.com/api/?key=38400956-ed3ce45b124f70d420fda24dd&q=${id}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${num}`)
       totalPhoto = data.totalHits
      const array = data.hits
         return array
     }
   


function createMarkup(arr) {
    return arr.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>
        `<div class="photo-card">
        <a href="${largeImageURL}">
     <img src="${webformatURL}" alt="${tags}" loading="lazy" />
       </a>
  <div class="info">
    <p class="info-item">
      <b>Likes '${likes}'</b>
    </p>
    <p class="info-item">
      <b>Views '${views}'</b>
    </p>
    <p class="info-item">
      <b>Comments '${comments}'</b>
    </p>
    <p class="info-item">
      <b>Downloads '${downloads}'</b>
    </p>
  </div>
</div>`).join('')
}


function smoothScrolling() { 
  const { height: cardHeight } = document
                    .querySelector(".gallery")
                    .firstElementChild.getBoundingClientRect();

               window.scrollBy({
                    top: cardHeight * 4,
                    behavior: "smooth",
                  });
}
  

 