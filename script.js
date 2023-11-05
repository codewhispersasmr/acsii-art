// element declaration
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const file = document.getElementById('file');
const sizeElem = document.getElementById('size');

// Cell class
class Cell {
    constructor(x, y, symbol, color) {
        this.x = x;
        this.y = y;
        this.symbol = symbol;
        this.color = color;
    }
    draw() {
        ctx.fillStyle = '#ffffff';
        ctx.fillText(this.symbol, this.x + 0.3, this.y + 0.3);
        ctx.fillStyle = this.color;
        ctx.fillText(this.symbol, this.x, this.y);
    }
}

// Acsii class
class Acsii {
    constructor(image, width, height) {
        this.image = image;
        this.width = width;
        this.height = height;
        this.cells = [];
    }
    init(size) {
        size = parseInt(size)
        ctx.drawImage(this.image, 0, 0, this.width, this.height);

        // get pixel data
        const pixels = ctx.getImageData(0, 0, this.width, this.height).data;
        for( let y = 0; y < this.height; y += size ) {
            for( let x = 0; x < this.width; x += size ) {
                const index = (y * this.width + x) * 4;
                const red = pixels[index];
                const green = pixels[index+1];
                const blue = pixels[index+2];
                const alpha = pixels[index+3];

                // create new Cell
                if( alpha > 0 ) {
                    const color = `rgb(${red}, ${green}, ${blue})`;
                    const grayScale = (red + green + blue) / 3;
                    const symbol = this.convertToSymbol(grayScale);
                    this.cells.push(new Cell(x, y, symbol, color));
                }

            }
        }
    }
    draw() {
        ctx.clearRect(0, 0, this.width, canvas.height);
        this.cells.forEach(c => c.draw());
    }
    convertToSymbol(g) {
        const grayRamp = " .:-=+*#%@".split("");
        const rampLength = grayRamp.length;

        return grayRamp[Math.ceil(((rampLength - 1) * g) / 255)];
    }
}

let acsii = null;
let image = null;

// function to show the generate acsii
function showAcsii(size) {
    acsii = new Acsii(image, canvas.width, canvas.height);
    acsii.init(size);
    ctx.font = size * 1.15 + 'px Verdana';
    acsii.draw();
}

// file change event function
file.addEventListener('change', () => {
    image = new Image();
    if( file.files.length > 0 ) {
        const fileReader = new FileReader();
        fileReader.onload = e => {
            image.src = e.target.result;

            image.onload = () => {
                image.height = image.height * (600 / image.width);
                image.width = 600;

                canvas.width = image.width;
                canvas.height = image.height;
                showAcsii(sizeElem.value);
            }

        }
        fileReader.readAsDataURL(file.files[0]);
    }
});

// size element change event function
sizeElem.addEventListener('input', () => {
    if( ! acsii ) return;
    showAcsii(sizeElem.value);
});
