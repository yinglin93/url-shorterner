function copy() {
  const copiedURL = document.querySelector('#shortURL').innerText

  navigator.clipboard.writeText(copiedURL)
    .then(() => alert('Copied the URL!'))
    .catch((err) => console.log('error'))
}

function inputAlert(){
  console.log('YO')
  // const inputedURL = document.getElementById('#inputedURL').innerText
  
  // if (!inputedURL) {
  //   alert('Please input URL')
  //   return true
  // }
}