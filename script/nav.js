window.addEventListener('load',function() {
    let items=this.document.querySelector('.main-menu').querySelectorAll('.item');
    let itemLists=this.document.querySelector('.main-menu').querySelectorAll('ul');
    for(let i=1;i<items.length-2;i++) {
        items[i].addEventListener('mouseover',function() {
            for(let j=1;j<itemLists.length;j++) {
                itemLists[j].style.display='none';
                
            }
            itemLists[i].style.display='block';
            // console.log(i);
        })
        itemLists[i].addEventListener('mouseout',function() {
            this.style.display='none';
        })
        items[i].addEventListener('mouseout',function() {
            itemLists[i].style.display='none';
        })

    }
})