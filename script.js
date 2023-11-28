const playBoard = document.querySelector(".play-board");
// menyimpan elemen HTML dengan kelas "score"
const scoreElement = document.querySelector(".score");
// kelas "high-score" disimpan dalam variabel highScoreElement
const highScoreElement = document.querySelector(".high-score");
// menyimpan NodeList dari semua elemen HTML dengan kelas "controls" dan tag "i". 
const controls = document.querySelectorAll(".controls i");

// status permainan
let gameOver = false;
// koordinat X dan Y untuk posisi makanan pada papan permainan
let foodX, foodY;
// koordinat X dan Y untuk posisi kepala ular pada papan permainan
let snakeX = 5, snakeY = 5;
// kecepatan pergerakan ular
let velocityX = 0, velocityY = 0;
// array yang menyimpan tubuh ular (koordinat elemen-elemen tubuh)
let snakeBody = [];
// ID interval yang digunakan untuk mengatur pergerakan ular secara teratur
let setIntervalId;
// skor pemain dalam permainan
let score = 0;


// untuk mengambil nilai tertinggi dari penyimpanan lokal/ menggunakan nilai 0 jika tidak ada nilai yang tersimpan
let highScore = localStorage.getItem("high-score") || 0;
//  untuk menampilkan nilai tertinggi
highScoreElement.innerText = `High Score: ${highScore}`;

// mendefinisikan fungsi untuk memperbarui posisi objek pada papan permainan
const updateFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

// untuk mendefinisikan  kondisi akhir permainan (game over)
const handleGameOver = () => {
   // menghentikan timer ketika permainan berakhir
    clearInterval(setIntervalId);
  // menampilkan message box 
    alert("Game Over! Tekan OK untuk mengulangi!");
 // reload halaman 
    location.reload();
}
//  mengubah arah pergerakan ular berdasarkan tombol panah yang ditekan.
const changeDirection = e => {
    // mengubah nilai kecepatan berdasarkan tombol kunci yang ditekan
    if(e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if(e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if(e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if(e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

// memanggil fungsi changeDirection setiap kali tombol kunci diklik dan meneruskan nilai dataset tombol sebagai objek
controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));

const initGame = () => {
    // jika permainan sudah berakhir, panggil fungsi handleGameOver
    if(gameOver) return handleGameOver();
    // jika permainan belum berakhir, buat string HTML dengan elemen makanan pada posisi yang ditentukan
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    // apakah ular menabrak makanan
    if(snakeX === foodX && snakeY === foodY) {
        updateFoodPosition(); // memperbarui posisi makanan
        snakeBody.push([foodY, foodX]); 
        score++; // menambah skor =1
        highScore = score >= highScore ? score : highScore; // memperbarui nilai tertinggi
        localStorage.setItem("high-score", highScore); // menyimpan nilai tertinggi ke dalam penyimpanan lokal
        scoreElement.innerText = `Score: ${score}`; // menetapkan teks skor pada elemen HTML
        highScoreElement.innerText = `High Score: ${highScore}`; // menetapkan teks nilai tertinggi pada elemen HTML
    }
    // memperbarui posisi kepala ular berdasarkan kecepatan pergerakan 
    snakeX += velocityX;
    snakeY += velocityY;
    
    // menggeser nilai-nilai elemen dalam tubuh ular ke depan sebanyak satu
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY]; // Setting first element of snake body to current snake position

    // memeriksa apakah kepala ular berada di luar batas papan permainan, jika ya, mengatur gameOver menjadi true
    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        return gameOver = true;
    }

    for (let i = 0; i < snakeBody.length; i++) {
        // menambahkan elemen div untuk setiap bagian tubuh ular
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        // memeriksa apakah kepala ular menabrak tubuhnya sendiri, jika ya, mengatur gameOver menjadi true
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    playBoard.innerHTML = html; // menetapkan string HTML yang berisi elemen-elemen ular ke dalam papan permainan
}

updateFoodPosition(); // memperbarui posisi makanan pada awal permainan
setIntervalId = setInterval(initGame, 100); // mengatur interval untuk memanggil fungsi initGame secara teratur (100 milidetik)
document.addEventListener("keyup", changeDirection); // menambahkan event listener untuk mendeteksi ketika tombol panah pada keyboard ditekan