const autoCompleteConfig = {
    renderOption(movie) {
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster
        return `
            <img src= "${imgSrc}"/>
            ${movie.Title} (${movie.Year})
            `;
    },

    inputValue(movie) {
        return movie.Title;
    },

    async fetchData(searchTerm) {
        const { data } = await axios.get('http://www.omdbapi.com', {
            params: {
                apikey: 'c8af1caa',
                s: searchTerm
            }
        });

        if (data.Error) {
            return []
        }
        return data.Search
    }

}

createAtuoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden')
        onMovieSelect(movie, document.querySelector('#left-summary'), 'left')
    },
})

createAtuoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden')
        onMovieSelect(movie, document.querySelector('#right-summary'), 'right')
    },
})

let leftMovie;
let rightMovie;
const onMovieSelect = async (movie, summaryElement, side) => {
    const response = await axios.get('http://www.omdbapi.com', {
        params: {
            apikey: 'c8af1caa',
            i: movie.imdbID
        }
    })

    summaryElement.innerHTML = movieTemplate(response.data)

    if (side === 'left') {
        leftMovie = response.data
    } else {
        rightMovie = response.data
    }

    if (leftMovie && rightMovie) {
        runComparison();
    }
}

const runComparison = () => {
    const leftSideStats = document.querySelectorAll(
        '#left-summary .notification'
    );
    const rightSideStats = document.querySelectorAll(
        '#right-summary .notification'
    );

    leftSideStats.forEach((leftStat, index) => {
        const rightStat = rightSideStats[index];

        const leftSideValue = parseInt(leftStat.dataset.value);
        const rightSideValue = parseInt(rightStat.dataset.value);

        if (rightSideValue > leftSideValue) {
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-warning');
        } else {
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-warning');
        }
    });
};


const movieTemplate = (movieDetail) => {
    const dollars = parseInt(movieDetail.BoxOffice.replace(/[$,]/g, ''))
    const matascore = parseInt(movieDetail.Metascore)
    const imdbRating = parseFloat(movieDetail.imdbRating)
    const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''))

    const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
        const value = parseInt(word)

        if (isNaN(value)) {
            return prev
        } else {
            return prev + value
        }
    }, 0);


    return `
    <article class="media">
        <figure class"media-left">
            <p class="image">
                <img src="${movieDetail.Poster}"/>
            </p>
        </figure>
        <div class="media-content">
            <div class="content">
                <h1>${movieDetail.Title}</h1>
                <h4>${movieDetail.Genre}</h4>
                <p>${movieDetail.Plot}</p>
            </div>
        </div>
    </article>

    <article class ="data-value=${awards} notification is-primary">
        <p class="title">${movieDetail.Awards}</p>
        <p class="subtitle">Awards</p>
    </article>

    <article class ="data-value=${dollars} notification is-primary">
        <p class="title">${movieDetail.BoxOffice}</p>
        <p class="subtitle">Box Office</p>
    </article>
    
    <article class ="data-value=${matascore} notification is-primary">
        <p class="title">${movieDetail.Metascore}</p>
        <p class="subtitle">Metascore</p>
    </article>
    
    <article class ="data-value=${imdbRating} notification is-primary">
        <p class="title">${movieDetail.imdbRating}</p>
        <p class="subtitle">IMDB Rating</p>
    </article>
    
    <article class ="data-value=${imdbVotes} notification is-primary">
        <p class="title">${movieDetail.imdbVotes}</p>
        <p class="subtitle">IMDB Votes</p>
    </article>
    `;
};