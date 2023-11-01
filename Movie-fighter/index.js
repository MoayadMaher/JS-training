const fetchData = async (searchTerm) => {
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
};

const root = document.querySelector('.autocomplete')
root.innerHTML = `
    <label><b>Search For a Movie</b></label>
    <input class="input"/>
    <div class="dropdown">
        <div class="dorpdown-menu">
            <div class="dropdown-content results">
            </div>
        </div>
    </div>
`

const input = document.querySelector('input')
const dropdown = document.querySelector('.dropdown')
const resultWrapper = document.querySelector('.results')


const onInput = async (event) => {
    const movies = await fetchData(event.target.value);
    console.log(movies)

    resultWrapper.innerHTML = '';
    dropdown.classList.add('is-active')

    for (let movie of movies) {
        const option = document.createElement('a')
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster

        option.classList.add('dropdown-item')
        option.innerHTML = `
            <img src= "${imgSrc}"/>
            ${movie.Title}
            `;

        resultWrapper.appendChild(option);
    }
}


input.addEventListener('input', debounce(onInput, 500))

// document.addEventListener('click', event => {

//     console.log(event.target)

//     if (!root.contains(event.target)) {
//         dropdown.classList = ""
//         console.log(event.target)
//     }
// })
