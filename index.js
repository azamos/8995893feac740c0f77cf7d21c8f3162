function main(){
    const container = document.getElementsByClassName('grid-container')[0];
    let i=1;
    while(i<31){
        let newDiv = document.createElement('div');
        newDiv.classList.add("grid-item");
        newDiv.style = `background-image: url('./images/image${i}.jpg');background-size: cover;height:10vh`
        container.appendChild(newDiv);
        i++;
    }
}