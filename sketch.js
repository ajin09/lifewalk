let video;
let faceMesh;
let faces = [];
let expression = "인식 대기 중..."; 
let prevExpression = "무표정"; 
let gameState = "MAIN_MENU"; 
let gameFont;
let eventActive = false;
let currentEvent = null;
let eventDescription = "";
let stageEvent1Done = false;
let stageEvent2Done = false;
let eventRecommendations = [];
let growthGainMessage = "";
let growthGainTimer = 0;
let notificationText = "";
let notificationTimer = 0;
let stageProgress = {
  baby: 0,
  teen: {
    computer: 0,
    music: 0,
    book: 0
  },
  adult: 0
};
let growthPopupAlpha = 0;
let growthPopupState = "NONE"; // IN, HOLD, OUT

// --- 게임 논리 해상도 고정 ---
const GW = 640;
const GH = 480;

// --- 배경 및 바닥 높이 고정 ---
const BG_H = 360; 
const BG_Y = (GH - BG_H) / 2; 
let groundY = BG_Y + BG_H; 
let bgX = 0; 

// --- 글로벌 마우스 좌표 및 타이머 ---
let mouseXScaled = 0;
let mouseYScaled = 0;
let gameFrame = 0; 

// --- 화면 전환(Fade) 관련 변수 ---
let transitionState = "NONE"; 
let transitionAlpha = 0;
let nextGameState = "";

// --- 이펙트 배열 ---
let clickEffects = [];
let particles = []; 

// --- 표정 인식 민감도 설정 변수 ---
let currentMouthWidth = 0; 
let currentMouthHeight = 0;
let smileThresh = 50; 
let mouthThresh = 25; 

// --- 튜토리얼 관련 변수 ---
let hasSmiled = false;
let hasOpenedMouth = false;
let hasNeutral = false;
let tutorialCompleteTime = 0; 

// --- 게임 진행 변수 ---
let gameMode = ""; 
let isPaused = false; 
let player;
let items = []; 

// 스토리 모드 변수
let currentStage = 1; 
let itemSpawnTimer = 0;
let smileStack = 0;
let openMouthStack = 0;
let itemScores = {
  "기본": 0,    
  "컴퓨터": 0,  
  "음악": 0,
  "책": 0,
  "직업전용": 0, 
  "술담배": 0    
};
let chosenJob = ""; 

let endingTitle = "";
let endingDescription = "";
let endingCalculated = false;

// 도전 모드 변수
let challengeChar = ""; 
let challengeScore = 0;
let challengeHP = 10;
let highScores = [0, 0, 0, 0, 0]; 
let currentHighScore = 0;         
let isNewRecord = false;          
let newRecordAnimTimer = 0;       
  
// --- 사운드 관련 변수 ---
let mainTheme01;
let endingSong;
let runningSound;
let jumpSound;
let eventGetSound; // ✅ 선택 시 재생할 효과음 변수
  
// --- 애니메이션 관련 변수 ---
let babyAnimationFrames = [];
let currentBabyFrame = 0;
let boyAnimationFrames = []; 
let currentBoyFrame = 0;

let devAnimationFrames = [];
let currentDevFrame = 0;
let musAnimationFrames = [];
let currentMusFrame = 0;
let docAnimationFrames = [];
let currentDocFrame = 0;

// --- 아이템 및 UI 이미지 변수 ---
let babyItem01, babyItem02;
let laptopItem, musicItem, studyItem;
let devItem, musItem, docItem, damageItem;
let mainMenu, startButton; 
let modeSelectBg;
let storyBtnImg;
let challengeBtnImg;

// --- 추가된 이미지 버튼 변수 ---
let backBtnImg, fullscreenBtnImg, settingStartBtnImg, stopBtnImg, tutorialSkipBtnImg;

function preload() {
  soundFormats('mp3', 'ogg');
  mainTheme01 = loadSound('main them idea 01.mp3');
  endingSong = loadSound('lifegameendingsong.mp3');
  runningSound = loadSound('runningsound.mp3');
  jumpSound = loadSound('jump.mp3');
  eventGetSound = loadSound('eventget.mp3'); // ✅ 이벤트 옵션 선택음 로드

  gameFont = loadFont('RiaSans-Bold.ttf');
  
  faceMesh = ml5.faceMesh({ maxFaces: 1 });
  
  babyAnimationFrames[0] = loadImage('baby01.png');
  babyAnimationFrames[1] = loadImage('baby02.png');
  babyAnimationFrames[2] = loadImage('baby03.png');
  babyAnimationFrames[3] = loadImage('baby04.png');

  boyAnimationFrames[0] = loadImage('boy01.png');
  boyAnimationFrames[1] = loadImage('boy02.png');
  boyAnimationFrames[2] = loadImage('boy03.png');
  boyAnimationFrames[3] = loadImage('boy04.png');
  
  docAnimationFrames[0] = loadImage('doc01.png');
  docAnimationFrames[1] = loadImage('doc02.png');
  docAnimationFrames[2] = loadImage('doc03.png');
  docAnimationFrames[3] = loadImage('doc04.png');
  
  musAnimationFrames[0] = loadImage('mus01.png');
  musAnimationFrames[1] = loadImage('mus02.png');
  musAnimationFrames[2] = loadImage('mus03.png');
  musAnimationFrames[3] = loadImage('mus04.png');
  
  devAnimationFrames[0] = loadImage('dev01.png');
  devAnimationFrames[1] = loadImage('dev02.png');
  devAnimationFrames[2] = loadImage('dev03.png');
  devAnimationFrames[3] = loadImage('dev04.png');
  
  babyItem01 = loadImage('babyitem01.png');
  babyItem02 = loadImage('babyitem02.png');
  laptopItem = loadImage('laptopitem.png'); 
  musicItem = loadImage('musicitem.png'); 
  studyItem = loadImage('studyitem.png'); 
  devItem = loadImage('devitem.png'); 
  musItem = loadImage('musitem.png'); 
  docItem = loadImage('docitem.png'); 
  damageItem = loadImage('damage.png'); 
  modeSelectBg = loadImage('modeselectbg.png');
  storyBtnImg = loadImage("storybutton.png");
  challengeBtnImg = loadImage("challengebutton.png");
  
  mainMenu = loadImage('mainmenu.png');
  startButton = loadImage('startbutton.png');

  backBtnImg = loadImage('back.png');
  fullscreenBtnImg = loadImage('fullscreen.png');
  settingStartBtnImg = loadImage('settingstart.png');
  stopBtnImg = loadImage('stop.png');
  tutorialSkipBtnImg = loadImage('tutorialskip.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont(gameFont);
  video = createCapture(VIDEO);
  video.size(GW, GH);
  video.hide();

  noCursor(); 

  faceMesh.detectStart(video, gotFaces);
  player = new Player();
  
  loadHighScores();

  // 기본 볼륨 설정
  if (mainTheme01) mainTheme01.setVolume(0.3);
  if (endingSong) endingSong.setVolume(0.3);
  if (runningSound) runningSound.setVolume(0.5);
  if (jumpSound) jumpSound.setVolume(0.5);
  if (eventGetSound) eventGetSound.setVolume(0.6); // ✅ 사운드 볼륨
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function loadHighScores() {
  let saved = localStorage.getItem('faceControlHighScores');
  if (saved) highScores = JSON.parse(saved);
  currentHighScore = highScores[0] || 0;
}

function gotFaces(results) {
  faces = results;
  if (faces.length > 0) {
    let keypoints = faces[0].keypoints;
    let leftMouth = keypoints[308];
    let rightMouth = keypoints[78];
    currentMouthWidth = dist(leftMouth.x, leftMouth.y, rightMouth.x, rightMouth.y);

    let topLip = keypoints[13];
    let bottomLip = keypoints[14];
    currentMouthHeight = dist(topLip.x, topLip.y, bottomLip.x, bottomLip.y);

    if (currentMouthHeight > mouthThresh) expression = "입 벌림";
    else if (currentMouthWidth > smileThresh) expression = "웃음";
    else expression = "무표정";
  } else {
    expression = "얼굴 인식 안 됨";
  }
}

function changeState(newState) {
  if (transitionState === "NONE") {
    nextGameState = newState;
    transitionState = "FADE_OUT";
  }
}

function drawThinText(txt, x, y, size, alignX, alignY, col = color(0)) {
  push();
  textSize(size);
  textAlign(alignX, alignY);
  noStroke(); 
  fill(col);
  text(txt, x, y);
  pop();
}

function drawTextWithOutline(txt, x, y, tSize = 16, hAlign = LEFT, vAlign = TOP, txtColor = color(255), outColor = color(50, 40, 40)) {
  push();
  textSize(tSize);
  textAlign(hAlign, vAlign);
  
  stroke(outColor);
  strokeWeight(tSize * 0.08);
  strokeJoin(ROUND);
  fill(txtColor);
  
  text(txt, x, y);
  pop();
}

function drawCanvasButton(x, y, w, h, label, tSize, baseColor = color(130, 200, 255), hoverColor = color(160, 220, 255), pressColor = color(100, 160, 220)) {
  let isHover = mouseXScaled > x && mouseXScaled < x + w && mouseYScaled > y && mouseYScaled < y + h;
  let isPressed = isHover && mouseIsPressed;
  
  let btnY = isPressed ? y + 4 : (isHover ? y - 2 : y); 
  
  noStroke();
  fill(0,20);
  rect(x, y + 3, w, h, 12);

  if (isPressed) fill(pressColor);        
  else if (isHover) fill(hoverColor);    
  else fill(baseColor);                  
  
  rect(x, btnY, w, h, 12);
  
  drawTextWithOutline(label, x + w / 2, btnY + h / 2, tSize, CENTER, CENTER, color(255));
}

function drawImageButton(img, x, y, w, h) {
  if (!img) return;
  let isHover = mouseXScaled > x && mouseXScaled < x + w && mouseYScaled > y && mouseYScaled < y + h;
  let isPressed = isHover && mouseIsPressed;
  
  push();
  let scaleAmt = isPressed ? 0.95 : (isHover ? 1.05 : 1.0);
  translate(x + w / 2, y + h / 2);
  scale(scaleAmt);
  if (isPressed) tint(200); 
  image(img, -w / 2, -h / 2, w, h);
  pop();
}

function spawnDust(x, y, count) {
  for(let i = 0; i < count; i++) {
    particles.push({
      x: x + random(-10, 10),
      y: y,
      vx: random(-3, -1), 
      vy: random(-2, 0.5),
      life: 200,
      size: random(4, 12)
    });
  }
}

function drawProceduralBackground(theme, x, y, w, h) {
  push();
  translate(x - 1, y);
  let extW = w + 2; 

  noStroke();
  if (theme === "BABY") {
    fill(255, 235, 238); rect(0, 0, extW, h); 
    fill(255, 218, 185); rect(0, h - 50, extW, 50); 
    fill(135, 206, 235); rect(150, 50, 160, 120, 20); 
    
    push(); translate(230, 110); rotate(gameFrame * 0.05); fill(255, 200, 50);
    for(let i=0; i<8; i++) { rotate(PI/4); triangle(-5, -20, 5, -20, 0, -35); }
    ellipse(0, 0, 40); pop();

    fill(255); 
    rect(150, 50, 160, 10, 5); rect(150, 160, 160, 10, 5); 
    rect(150, 50, 10, 120, 5); rect(300, 50, 10, 120, 5); rect(225, 50, 10, 120, 5); 

    push(); translate(450, 0); stroke(150); strokeWeight(2); line(0,0, 0, 60);
    rotate(sin(gameFrame * 0.05) * 0.2); line(-40, 60, 40, 60);
    line(-40, 60, -40, 90); noStroke(); fill(255, 200, 200); ellipse(-40, 90, 20);
    stroke(150); line(40, 60, 40, 100); noStroke(); fill(200, 200, 255); ellipse(40, 100, 20); pop();

    fill(255, 182, 193); rect(600, h - 90, 40, 40, 8); fill(255); textStyle(BOLD); textSize(20); textAlign(CENTER, CENTER); text("A", 620, h - 70);
    fill(135, 206, 235); rect(650, h - 70, 40, 40, 8); fill(255); text("B", 670, h - 50);

    fill(135, 206, 235); rect(850, 50, 160, 120, 20);
    push(); translate(930, 110); rotate(gameFrame * 0.05); fill(255, 200, 50);
    for(let i=0; i<8; i++) { rotate(PI/4); triangle(-5, -20, 5, -20, 0, -35); }
    ellipse(0, 0, 40); pop();
    fill(255); 
    rect(850, 50, 160, 10, 5); rect(850, 160, 160, 10, 5);
    rect(850, 50, 10, 120, 5); rect(1000, 50, 10, 120, 5); rect(925, 50, 10, 120, 5);

    fill(255, 255, 100); ellipse(1100, h - 65 - abs(sin(gameFrame * 0.1)) * 30, 30);
  } 
  else if (theme === "TEEN") {
    fill(220, 245, 230); rect(0, 0, extW, h); 
    fill(200, 160, 120); rect(0, h - 50, extW, 50); 
    fill(100, 70, 40); rect(100, 40, 340, 160, 10);
    fill(40, 100, 60); rect(110, 50, 320, 140, 5);
    stroke(255, 200); strokeWeight(2); line(130, 80, 160, 80); line(145, 65, 145, 95); noStroke();
    fill(255); stroke(0); strokeWeight(3); ellipse(520, 80, 60);
    push(); translate(520, 80); rotate(gameFrame * 0.05); line(0,0, 0, -20); pop();
    push(); translate(520, 80); rotate(gameFrame * 0.01); line(0,0, 15, 0); pop();
    noStroke();
    fill(255); rect(700, 40, 250, 160, 10); 
    fill(135, 206, 235); rect(710, 50, 110, 140, 5); rect(830, 50, 110, 140, 5); 
    fill(255, 200, 50); ellipse(750, 80, 40); 
    fill(150, 100, 50); rect(250, h - 100, 80, 50, 5); fill(200, 50, 50); ellipse(290, h - 105, 15); 
    fill(150, 100, 50); rect(600, h - 100, 80, 50, 5);
    fill(150, 100, 50); rect(1000, h - 100, 80, 50, 5);
  } 
  else if (theme === "DEV") {
    fill(40, 45, 55); rect(0, 0, extW, h); 
    fill(80, 85, 95); rect(0, h - 50, extW, 50); 
    fill(240); rect(80, 40, 180, 120, 10);
    stroke(50); strokeWeight(3); line(100, 60, 140, 80); rect(140, 70, 40, 30); noStroke();
    fill(60); rect(350, h - 120, 200, 70, 5);
    fill(20); rect(370, h - 180, 70, 50, 5); rect(460, h - 180, 70, 50, 5);
    fill(0, 255, 0); let codeY = gameFrame % 50;
    rect(375, h - 175 + (codeY % 40), 40, 2); rect(375, h - 165 + ((codeY + 15) % 40), 60, 2);
    fill(50); rect(700, 40, 200, 150, 10);
    fill(20, 20, 60); rect(710, 50, 180, 130, 5); 
    fill(255, 255, 200); ellipse(750, 80, 30); 
    fill(255, 255, 255, abs(sin(gameFrame*0.05))*255); ellipse(800, 70, 3); ellipse(850, 90, 4); 
    fill(100); rect(1050, 50, 100, 220, 5);
    fill(20); rect(1060, 60, 80, 40); rect(1060, 120, 80, 40); rect(1060, 180, 80, 40);
    fill(gameFrame % 20 < 10 ? color(0, 255, 0) : color(0, 100, 0));
    ellipse(1075, 80, 10); ellipse(1075, 140, 10); ellipse(1075, 200, 10);
  } 
  else if (theme === "DOC") {
    fill(230, 250, 255); rect(0, 0, extW, h); 
    fill(200, 220, 230); rect(0, h - 50, extW, 50); 
    fill(180, 200, 220); rect(100, 40, 120, 100, 10);
    if (gameFrame % 40 < 20) fill(255, 50, 50, 100); else fill(50, 50, 255, 100);
    rect(100, 40, 120, 100, 10);
    fill(30); rect(350, h - 160, 120, 80, 10);
    stroke(0, 255, 0); strokeWeight(2); noFill();
    beginShape(); let beatOffset = gameFrame * 3;
    for(let i=0; i<100; i+=5) {
      let hby = h - 120; let pos = (i + beatOffset) % 100;
      if (pos > 40 && pos < 50) hby -= 25; else if (pos >= 50 && pos < 60) hby += 15;
      vertex(360 + i, hby);
    }
    endShape(); noStroke();
    fill(200); rect(550, 40, 5, 200); 
    fill(255, 255, 255, 200); rect(540, 70, 25, 40, 5); 
    fill(150, 200, 255, 200); ellipse(552, 115 + (gameFrame % 50), 5, 8); 
    fill(200); rect(750, 40, 200, 150, 10);
    fill(135, 206, 235); rect(760, 50, 180, 130, 5);
    fill(200); rect(780, 100, 40, 80); rect(840, 80, 50, 100); 
    fill(255); stroke(200); strokeWeight(2); rect(1050, 60, 100, 180, 10);
    fill(200, 240, 255, 150); rect(1060, 70, 80, 160, 5); noStroke();
  } 
  else if (theme === "MUS") {
    fill(20, 10, 40); rect(0, 0, extW, h); 
    fill(10, 5, 20); rect(0, h - 50, extW, 50); 
    let alphaLight = 100 + sin(gameFrame * 0.1) * 50;
    fill(255, 255, 0, alphaLight); triangle(200, 0, 0, h - 50, 400, h - 50);
    fill(0, 255, 255, alphaLight); triangle(800, 0, 600, h - 50, 1000, h - 50);
    fill(255, 0, 255, alphaLight); triangle(1100, 0, 900, h - 50, 1280, h - 50);
    for(let i=0; i<10; i++) {
      let eqH = 20 + noise(i, gameFrame * 0.1) * 80;
      fill(50 + i * 20, 255 - i * 10, 255);
      rect(250 + i * 30, h - 50 - eqH, 20, eqH, 5);
      let eqH2 = 20 + noise(i+10, gameFrame * 0.1) * 80;
      fill(255, 100 + i * 15, 100);
      rect(750 + i * 30, h - 50 - eqH2, 20, eqH2, 5);
    }
    push(); translate(350, 50); rotate(gameFrame * 0.02); fill(200); ellipse(0,0, 60); fill(255); ellipse(-15, -15, 10); ellipse(10, 15, 15); pop();
    push(); translate(1000, 50); rotate(gameFrame * -0.02); fill(200); ellipse(0,0, 60); fill(255); ellipse(-15, -15, 10); ellipse(10, 15, 15); pop();
    fill(40); rect(100, h - 130, 60, 80, 5); fill(10); ellipse(130, h - 105, 20); ellipse(130, h - 75, 30);
    fill(40); rect(600, h - 130, 60, 80, 5); fill(10); ellipse(630, h - 105, 20); ellipse(630, h - 75, 30);
    fill(40); rect(1150, h - 130, 60, 80, 5); fill(10); ellipse(1180, h - 105, 20); ellipse(1180, h - 75, 30);
  }
  pop();
}

function getBackgroundTheme() {
  if (gameMode === "STORY") {
    if (currentStage === 1) return "BABY";
    if (currentStage === 2) return "TEEN";
    if (currentStage === 3) {
      if (chosenJob === "의사") return "DOC";
      if (chosenJob === "개발자") return "DEV";
      if (chosenJob === "가수") return "MUS";
    }
  } else if (gameMode === "CHALLENGE") {
    if (challengeChar === "아기") return "BABY";
    if (challengeChar === "청소년") return "TEEN";
    if (challengeChar === "의사") return "DOC";
    if (challengeChar === "개발자") return "DEV";
    if (challengeChar === "가수") return "MUS";
  }
  return "BABY"; 
}

function draw() {
  background(20); 

  let sf = min(width / GW, height / GH);
  let ox = (width - GW * sf) / 2;
  let oy = (height - GH * sf) / 2;

  mouseXScaled = (mouseX - ox) / sf;
  mouseYScaled = (mouseY - oy) / sf;

  if (!isPaused && gameState === "PLAYING") {
    gameFrame++;
  }

  push();
  translate(ox, oy);
  scale(sf);

  if (gameState === "SETTINGS" || gameState === "TUTORIAL") {
    push();
    translate(GW, 0);
    scale(-1, 1);
    image(video, 0, 0, GW, GH);
    pop();
  }

  if (gameState === "MAIN_MENU") drawMainMenu();
  else if (gameState === "MODE_SELECT") drawModeSelect();
  else if (gameState === "CHAR_SELECT") drawCharSelect();
  else if (gameState === "SETTINGS") { fill(0, 150); rect(0, 0, GW, GH); drawSettingsScreen(); }
  else if (gameState === "TUTORIAL") { fill(0, 150); rect(0, 0, GW, GH); drawTutorialScreen(); }
  else if (gameState === "PLAYING") drawGameScene();
  else if (gameState === "ENDING") drawEndingScreen();
  
  drawImageButton(fullscreenBtnImg, GW - 110, 15, 95, 40);

  if (transitionState === "FADE_OUT") {
    transitionAlpha += 15;
    if (transitionAlpha >= 255) {
      transitionAlpha = 255;
      gameState = nextGameState;
      transitionState = "FADE_IN";
      
      if (mainTheme01) {
        if (gameState === "PLAYING") {
          mainTheme01.setVolume(0.15); 
        } else {
          mainTheme01.setVolume(0.3);  
        }
      }

      if (gameState !== "ENDING" && mainTheme01 && !mainTheme01.isPlaying()) {
        mainTheme01.loop();
      }
    }
  } else if (transitionState === "FADE_IN") {
    transitionAlpha -= 15;
    if (transitionAlpha <= 0) {
      transitionAlpha = 0;
      transitionState = "NONE";
    }
  }

  if (transitionAlpha > 0) {
    fill(0, transitionAlpha);
    noStroke();
    rect(0, 0, GW, GH);
  }

  for (let i = clickEffects.length - 1; i >= 0; i--) {
    let ce = clickEffects[i];
    noFill();
    stroke(255, 255, 255, ce.alpha);
    strokeWeight(4);
    ellipse(ce.x, ce.y, ce.r * 2);
    ce.r += 3; 
    ce.alpha -= 20; 
    if (ce.alpha <= 0) clickEffects.splice(i, 1);
  }

  fill(255, 200, 200); stroke(0); strokeWeight(3); strokeJoin(ROUND);
  triangle(mouseXScaled, mouseYScaled, mouseXScaled + 20, mouseYScaled + 8, mouseXScaled + 8, mouseYScaled + 20);

  pop();
  
  if (growthPopupState === "IN") {
    growthPopupAlpha += 20;
    if (growthPopupAlpha >= 255) {
      growthPopupAlpha = 255;
      growthPopupState = "HOLD";
    }
  }

  if (growthPopupState === "HOLD") {
    growthGainTimer--;
    if (growthGainTimer <= 0) {
      growthPopupState = "OUT";
    }
  }

  if (growthPopupState === "OUT") {
    growthPopupAlpha -= 20;
    if (growthPopupAlpha <= 0) {
      growthPopupAlpha = 0;
      growthPopupState = "NONE";
    }
  }
  
  if (notificationTimer > 0) {
    push();
    fill(0, 180);
    rect(GW/2 - 200, 30, 400, 50, 12);
    fill(255); textAlign(CENTER, CENTER); textSize(18); text(notificationText, GW/2, 55);
    pop();
    notificationTimer--;
  }
}

// ✅ [레벨업/종료 조건 분리 코드] 수시로 레벨업이나 엔딩 조건을 판정
function checkLevelUp() {
  if (gameMode !== "STORY") return;
  
  if (currentStage === 1 && itemScores["기본"] >= 10) {
    currentStage = 2; stageEvent1Done = false; stageEvent2Done = false; items = []; bgX = 0;
    showNotification("유아기를 졸업하고 청소년기가 되었습니다!");
  } 
  else if (currentStage === 2 && (itemScores["컴퓨터"] >= 10 || itemScores["음악"] >= 10 || itemScores["책"] >= 10)) {
    let best = max(itemScores["컴퓨터"], itemScores["음악"], itemScores["책"]);
    if (best === itemScores["컴퓨터"]) chosenJob = "개발자";
    else if (best === itemScores["음악"]) chosenJob = "가수";
    else chosenJob = "의사";
    currentStage = 3; stageEvent1Done = false; stageEvent2Done = false; items = []; bgX = 0;
    showNotification("성인이 되었습니다!");
  } 
  else if (currentStage === 3) {
    if (itemScores["직업전용"] >= 20 || itemScores["술담배"] >= 10) {
      if (transitionState === "NONE" && gameState !== "ENDING") {
        changeState("ENDING");
      }
    }
  }
}

function checkStageEvents() {
  let progress = 0;
  if(currentStage === 1){ progress = itemScores["기본"]; }
  if(currentStage === 2){ progress = max(itemScores["컴퓨터"], itemScores["음악"], itemScores["책"]); }
  if(currentStage === 3){ progress = itemScores["직업전용"]; }

  if(progress >= 3 && !stageEvent1Done){
    openRandomEvent();
    stageEvent1Done = true;
  }
  if(progress >= 7 && !stageEvent2Done){
    openRandomEvent();
    stageEvent2Done = true;
  }
}

function showNotification(msg) {
  notificationText = msg;
  notificationTimer = 180; 
}

function showGrowthPopup(msg) {
  growthGainMessage = msg;
  growthPopupState = "IN";
  growthGainTimer = 120;
}

function drawMainMenu() {
  background(50);
  if (mainMenu) image(mainMenu, 0, 0, GW, GH);
  
  let btnW = 200; let btnH = 60;
  let btnX = GW/2 - btnW/2; let btnY = GH/2 + 50;

  let isHover = mouseXScaled > btnX && mouseXScaled < btnX + btnW && mouseYScaled > btnY && mouseYScaled < btnY + btnH;
  let isPressed = isHover && mouseIsPressed;

  if (startButton) {
    push();
    let scaleAmt = isPressed ? 0.95 : (isHover ? 1.05 : 1.0);
    translate(btnX + btnW/2, btnY + btnH/2);
    scale(scaleAmt);
    if (isPressed) tint(200); 
    image(startButton, -btnW/2, -btnH/2, btnW, btnH);
    pop();
  } else {
    drawCanvasButton(btnX, btnY, btnW, btnH, "게임 시작", 28, color(255, 150, 150), color(255, 180, 180), color(220, 120, 120));
  }

  push();
textSize(10);
textAlign(CENTER, BOTTOM);
// 그림자
noStroke();
fill(0, 0, 0, 120);
text("김나림, 김형진, 윤소연", GW / 2 + 1.5, GH - 20 + 1.5);
// 외곽선 + 본문
stroke(color(252, 182, 122));
strokeWeight(0.8);
strokeJoin(ROUND);
fill(255, 255, 180);
text("김나림, 김형진, 윤소연", GW / 2, GH - 20);
pop();
}

function drawModeSelect() {
  if(modeSelectBg){ image(modeSelectBg, 0, 0, GW, GH); }
  push();
  let boxW = 360; let boxH = 70; let boxX = GW / 2 - boxW / 2; let boxY = 80;
  let blink = sin(frameCount * 0.12);
  let alpha = map(sin(frameCount * 0.05), -1, 1, 180, 255);

  noStroke(); fill(255, 255, 255, 80); rect(boxX, boxY, boxW, boxH, 16);
  fill(0, 30); rect(boxX, boxY + 4, boxW, boxH, 16);
  fill(0, 80 * (alpha / 255)); textAlign(CENTER, CENTER); textSize(32); text("게임 모드를 선택하세요", GW/2 + 2, boxY + boxH/2 + 2);
  fill(255, alpha); text("게임 모드를 선택하세요", GW/2, boxY + boxH/2);
  pop();
  
  let storyX = GW/2 - 220; let challengeX = GW/2 + 20; let btnY = 180;
  image(storyBtnImg, storyX, btnY, 200, 150);
  image(challengeBtnImg, challengeX, btnY, 200, 150);
  
  let hoverStory = mouseXScaled > storyX && mouseXScaled < storyX + 200 && mouseYScaled > btnY && mouseYScaled < btnY + 150;
  let hoverChallenge = mouseXScaled > challengeX && mouseXScaled < challengeX + 200 && mouseYScaled > btnY && mouseYScaled < btnY + 150;

  push(); translate(storyX + 100, btnY + 60); scale(hoverStory ? 1.05 : 1); image(storyBtnImg, -100, -60, 200, 150); pop();
  push(); translate(challengeX + 100, btnY + 60); scale(hoverChallenge ? 1.05 : 1); image(challengeBtnImg, -100, -60, 200, 150); pop();
  
  drawImageButton(backBtnImg, 15, 15, 95, 40); 
}

function drawCharSelect() {
  if (modeSelectBg) { image(modeSelectBg, 0, 0, GW, GH); }
  fill(0, 0, 0, 100); rect(0, 0, GW, GH);

  drawTextWithOutline("도전 모드 캐릭터 선택", GW/2, 60, 36, CENTER, TOP, color(255));
  let chars = ["아기", "청소년", "의사", "개발자", "가수"];
  for (let i = 0; i < chars.length; i++) {
    drawCanvasButton(GW/2 - 250 + (i * 100), 200, 80, 80, chars[i], 18, color(250, 200, 250), color(255, 230, 255), color(220, 170, 220));
  }
  
  drawImageButton(backBtnImg, 15, 15, 95, 40); 
}

function drawSettingsScreen() {
  drawTextWithOutline(" 표정 인식 민감도 설정 ", GW / 2, 60, 28, CENTER, TOP);
  drawImageButton(backBtnImg, 15, 15, 95, 40);

  fill(255, 255, 0); textSize(26); stroke(0); strokeWeight(3); textAlign(CENTER, CENTER);
  text(`현재 인식 상태: [ ${expression} ]`, GW / 2, 120);

  if (expression === "웃음") { drawTextWithOutline("웃으면 캐릭터가 점프합니다!", GW / 2, 150, 16, CENTER, TOP, color(200, 255, 200)); }
  if (expression === "입 벌림") { drawTextWithOutline("입 벌리면 캐릭터가 더블 점프합니다!", GW / 2, 150, 16, CENTER, TOP, color(200, 255, 200)); }
  
  drawTextWithOutline(`1. 내 기본 입꼬리 거리: ${Math.floor(currentMouthWidth)}`, 50, 190, 20, LEFT, CENTER);
  drawTextWithOutline("웃음 인식 기준점 :", 50, 230, 20, LEFT, CENTER);
  drawCanvasButton(240, 215, 40, 30, "-", 20); drawTextWithOutline(smileThresh, 310, 230, 24, CENTER, CENTER); drawCanvasButton(340, 215, 40, 30, "+", 20);
  drawTextWithOutline("Tip: 무표정일 때 거리보다 10~20 높게 맞추세요.", 50, 260, 14, LEFT, CENTER, color(200, 200, 200));

  drawTextWithOutline(`2. 내 기본 입술 거리: ${Math.floor(currentMouthHeight)}`, 50, 310, 20, LEFT, CENTER);
  drawTextWithOutline("입벌림 인식 기준점 :", 50, 350, 20, LEFT, CENTER);
  drawCanvasButton(250, 335, 40, 30, "-", 20); drawTextWithOutline(mouthThresh, 320, 350, 24, CENTER, CENTER); drawCanvasButton(350, 335, 40, 30, "+", 20);
  drawTextWithOutline("Tip: 다물었을 때 거리보다 20~30 높게 맞추세요.", 50, 380, 14, LEFT, CENTER, color(200, 200, 200));

  drawImageButton(settingStartBtnImg, GW / 2 - 120, 420, 240, 45);
}

function drawTutorialScreen() {
  if (expression === "웃음") hasSmiled = true;
  if (expression === "입 벌림") hasOpenedMouth = true;
  if (expression === "무표정") hasNeutral = true;

  drawTextWithOutline("튜토리얼 : 표정을 지어보세요", GW / 2, 50, 28, CENTER, TOP);
  drawTextWithOutline("현재 표정: " + expression, GW / 2, 100, 26, CENTER, TOP, color(255, 255, 100));

  drawTextWithOutline("미소를 지어보세요!: " + (hasSmiled ? "완료" : "대기중"), GW / 2, 200, 22, CENTER, TOP);
  drawTextWithOutline("입을 벌려보세요: " + (hasOpenedMouth ? "완료" : "대기중"), GW / 2, 250, 22, CENTER, TOP);
  drawTextWithOutline("무표정을 지어보세요: " + (hasNeutral ? "완료" : "대기중"), GW / 2, 300, 22, CENTER, TOP);

  if (hasSmiled && hasOpenedMouth && hasNeutral) {
    if (tutorialCompleteTime === 0) tutorialCompleteTime = millis();
    let elapsed = millis() - tutorialCompleteTime;
    let remain = max(0, 3 - floor(elapsed / 1000));
    drawTextWithOutline(`완료! ${remain}초 뒤 게임이 시작됩니다.`, GW / 2, 380, 24, CENTER, TOP, color(100, 255, 100));
    if (remain === 0 && transitionState === "NONE") { changeState("PLAYING"); }
  }

  let skipW = 140;
  let skipH = tutorialSkipBtnImg ? skipW * (tutorialSkipBtnImg.height / tutorialSkipBtnImg.width) : 40;
  drawImageButton(tutorialSkipBtnImg, GW - skipW - 20, GH - skipH - 20, skipW, skipH);
}

function openRandomEvent(){
  eventActive = true;
  isPaused = true;
  
  if(currentStage === 1){
    let stage1Events = [
      { title:"첫 걸음마", description:"부모님이 두 팔을 벌리고 기다리고 있습니다.", options:[ {name:"용감하게 걸어간다", reward:20}, {name:"천천히 기어간다", reward:10}, {name:"주저앉는다", reward:5} ] },
      { title:"장난감 선택", description:"알록달록한 장난감들이 가득 놓여 있습니다.", options:[ {name:"블록 놀이", reward:20}, {name:"그림책 보기", reward:15}, {name:"낮잠 자기", reward:5} ] },
      { title:"놀이터 데뷔", description:"처음으로 놀이터에 가게 되었습니다.", options:[ {name:"친구들과 논다", reward:20}, {name:"엄마 옆에만 있다", reward:10}, {name:"집에 가고 싶다", reward:5} ] },
      { title:"첫 유치원", description:"새로운 친구들을 만나는 날입니다.", options:[ {name:"먼저 인사한다", reward:20}, {name:"조용히 지켜본다", reward:10}, {name:"숨는다", reward:5} ] }
    ];
    currentEvent = random(stage1Events);
  }
  else if(currentStage === 2){
    let stage2Events = [
      { title:"시험 기간", description:"중간고사가 다가오고 있습니다.", options:[ {name:"열심히 공부한다", reward:20}, {name:"적당히 한다", reward:10}, {name:"게임만 한다", reward:0} ] },
      { title:"동아리 활동", description:"새로운 동아리에 가입할 수 있습니다.", options:[ {name:"개발 동아리", reward:20}, {name:"음악 동아리", reward:15}, {name:"가입 안 함", reward:5} ] },
      { title:"진로 고민", description:"미래에 무엇이 되고 싶은지 생각하게 됩니다.", options:[ {name:"목표를 정한다", reward:20}, {name:"조금 더 고민한다", reward:10}, {name:"생각 안 한다", reward:0} ] },
      { title:"친구와의 약속", description:"친구가 함께 공부하자고 합니다.", options:[ {name:"함께 공부한다", reward:20}, {name:"잠깐 놀고 공부한다", reward:10}, {name:"약속을 거절한다", reward:5} ] }
    ];
    currentEvent = random(stage2Events);
  }
  else if(currentStage === 3){
    if(chosenJob === "개발자"){
      let devEvents = [
        { title:"프로젝트 제안", description:"대기업에서 프로젝트 제안이 들어왔다.", options:[
          {name:"수락", reward:5}, {name:"검토", reward:3}, {name:"거절", reward:1}
        ]},
        { title:"팀원 갈등", description:"팀원과 기술 방향으로 의견 충돌이 생겼다.", options:[
          {name:"내 주장을 관철", reward:4}, {name:"타협점을 찾는다", reward:5}, {name:"그냥 따른다", reward:2}
        ]},
        { title:"이직 제안", description:"스타트업에서 파격적인 조건으로 이직을 제안했다.", options:[
          {name:"이직한다", reward:5}, {name:"조건을 협상한다", reward:4}, {name:"거절한다", reward:2}
        ]},
        { title:"번아웃", description:"야근이 계속되어 번아웃이 왔다.", options:[
          {name:"휴가를 낸다", reward:4}, {name:"억지로 버틴다", reward:2}, {name:"퇴사한다", reward:1}
        ]}
      ];
      currentEvent = random(devEvents);
    }
    else if(chosenJob === "의사"){
      let docEvents = [
        { title:"응급 환자", description:"응급 환자가 병원에 실려왔다.", options:[
          {name:"직접 치료", reward:5}, {name:"선배 도움", reward:3}, {name:"인계", reward:1}
        ]},
        { title:"의료 분쟁", description:"환자 보호자가 치료 결과에 이의를 제기했다.", options:[
          {name:"충분히 설명한다", reward:5}, {name:"법적 대응 준비", reward:3}, {name:"무시한다", reward:1}
        ]},
        { title:"해외 연수 기회", description:"유명 병원에서 해외 연수 제안이 들어왔다.", options:[
          {name:"지원한다", reward:5}, {name:"고민해본다", reward:3}, {name:"포기한다", reward:2}
        ]},
        { title:"과로", description:"당직이 계속되어 몸이 한계에 다다랐다.", options:[
          {name:"휴가를 신청한다", reward:4}, {name:"버텨낸다", reward:3}, {name:"병원을 옮긴다", reward:2}
        ]}
      ];
      currentEvent = random(docEvents);
    }
    else if(chosenJob === "가수"){
      let musEvents = [
        { title:"방송 출연", description:"인기 프로그램에서 섭외가 들어왔다.", options:[
          {name:"출연", reward:5}, {name:"연습 후 출연", reward:3}, {name:"거절", reward:1}
        ]},
        { title:"악플 논란", description:"SNS에 악플이 쏟아지기 시작했다.", options:[
          {name:"공식 입장 발표", reward:5}, {name:"무시한다", reward:3}, {name:"SNS를 닫는다", reward:2}
        ]},
        { title:"해외 공연 제안", description:"해외 페스티벌에서 공연 요청이 왔다.", options:[
          {name:"수락한다", reward:5}, {name:"일정을 조율한다", reward:4}, {name:"거절한다", reward:1}
        ]},
        { title:"슬럼프", description:"새 앨범 작업이 막혀 슬럼프가 왔다.", options:[
          {name:"여행을 떠난다", reward:4}, {name:"동료에게 도움을 구한다", reward:5}, {name:"혼자 버틴다", reward:2}
        ]}
      ];
      currentEvent = random(musEvents);
    }
  }
}

function drawGameScene() {
  
  
  background(0); 
  let theme = getBackgroundTheme();
  let drawX = Math.floor(bgX); 
  let drawW = GW * 2; 

  drawProceduralBackground(theme, drawX, BG_Y, drawW, BG_H);
  drawProceduralBackground(theme, drawX + drawW, BG_Y, drawW, BG_H);

  if (!isPaused) {
    bgX -= 3; 
    if (bgX <= -drawW) bgX += drawW; 
  }

  // --- 달리기 사운드 처리 ---
  if (gameState === "PLAYING" && !isPaused && !eventActive && player.y === groundY) {
    if (runningSound && !runningSound.isPlaying()) {
      runningSound.loop();
    }
  } else {
    if (runningSound && runningSound.isPlaying()) {
      runningSound.pause(); 
    }
  }

  if (!isPaused) {
    if (expression !== prevExpression) {
      if (expression === "웃음") { player.jump(); smileStack++; }
      else if (expression === "입 벌림") { player.doubleJump(); openMouthStack++; }
    }
    prevExpression = expression;
  }

  if (!isPaused) {
    itemSpawnTimer++;
    if (itemSpawnTimer > 60) {
      spawnItem();
      itemSpawnTimer = 0;
    }
  }

  for (let i = items.length - 1; i >= 0; i--) {
    let item = items[i];
    if (!isPaused) item.update();
    item.display();

    if (!isPaused) {
      let d = dist(player.x + player.size/2, player.y - player.size/2, item.x, item.y);
      if (d < player.size/2 + item.size/2) {
        if (gameMode === "STORY") {
          // ✅ 아이템 삭제를 배열 인덱스 꼬임 방지를 위해 먼저 수행
          itemScores[item.type]++;
          items.splice(i, 1); 

          checkStageEvents(); // 이벤트 발생 조건
          checkLevelUp();     // 레벨업 & 엔딩
        } 
        else if (gameMode === "CHALLENGE") {
          if (item.type === "장애물") challengeHP -= 3;
          else if (item.type === "회복") { challengeHP += 1; if (challengeHP > 10) challengeHP = 10; }
          items.splice(i, 1);
          if (challengeHP <= 0) {
            changeState("ENDING");
            return;
          }
        }
        continue;
      }
      if (item.x < -50) items.splice(i, 1);
    }
  }

  if (!isPaused) player.update();
  
  noStroke();
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    if (!isPaused) { p.x += p.vx; p.y += p.vy; p.life -= 15; }
    fill(255, 230, 200, max(0, p.life)); ellipse(p.x, p.y, p.size);
    if (p.life <= 0) particles.splice(i, 1);
  }
  
  player.display();
  
  if (gameMode === "STORY") {
    drawStageGauge();
  }

  // ✅ UI 출력 시 소수점 자르기 (Math.floor 적용)
  if (gameMode === "STORY") {
    let stageName = currentStage === 1 ? "유아기" : currentStage === 2 ? "청소년기" : "성년기";
    drawTextWithOutline(`[Stage ${currentStage}] ${stageName}`, 15, 15, 20, LEFT, TOP);
    drawTextWithOutline(`웃음: ${smileStack}  |  입벌림: ${openMouthStack}`, 15, 45, 18, LEFT, TOP, color(255, 255, 150));

    if (currentStage === 1) {
      drawTextWithOutline("안내: 아이템을 10개 먹어 아기를 성장시키세요!", 15, 75, 16, LEFT, TOP);
      drawTextWithOutline(`습득: ${Math.floor(itemScores["기본"])} / 10`, 15, 100, 16, LEFT, TOP);
    } else if (currentStage === 2) {
      drawTextWithOutline("안내: 원하는 직업 아이템을 먼저 10개 모으세요!", 15, 75, 16, LEFT, TOP);
      drawTextWithOutline(`코딩: ${Math.floor(itemScores["컴퓨터"])}/10  &  음악: ${Math.floor(itemScores["음악"])}/10  &  공부: ${Math.floor(itemScores["책"])}/10`, 15, 100, 16, LEFT, TOP);
    } else if (currentStage === 3) {
      drawTextWithOutline(`당신의 직업: [${chosenJob}]`, 15, 75, 18, LEFT, TOP, color(150, 255, 150));
      drawTextWithOutline(`경험치: ${Math.floor(itemScores["직업전용"])}/20  &  술/담배: ${Math.floor(itemScores["술담배"])}/10`, 15, 100, 16, LEFT, TOP);
    }
  } 
  else if (gameMode === "CHALLENGE") {
    if (!isPaused && gameFrame % 30 === 0) {
      challengeScore += 1;
      if (currentHighScore > 0 && challengeScore > currentHighScore && !isNewRecord) {
        isNewRecord = true;
        newRecordAnimTimer = 180; 
      }
    }
    drawTextWithOutline(`캐릭터: ${challengeChar}`, 15, 15, 20, LEFT, TOP);
    drawTextWithOutline(`거리 점수: ${challengeScore} M`, 15, 45, 20, LEFT, TOP, color(150, 255, 150));
    
    noStroke(); fill(50, 200); rect(15, 80, 200, 25, 15);
    fill(255, 80, 80); let hpWidth = map(max(0, challengeHP), 0, 10, 0, 200); rect(15, 80, hpWidth, 25, 15);
    stroke(255); strokeWeight(3); noFill(); rect(15, 80, 200, 25, 15);
    
    drawTextWithOutline(`HP : ${max(0, challengeHP)} / 10`, 115, 92, 18, CENTER, CENTER);

    if (newRecordAnimTimer > 0 && !isPaused) {
      push(); let scaleAnim = 1 + sin(frameCount * 0.15) * 0.15; translate(GW / 2, GH / 3); scale(scaleAnim);
      drawTextWithOutline(" NEW RECORD! ", 0, 0, 40, CENTER, CENTER, color(255, 255, 0), color(200, 50, 0));
      pop(); newRecordAnimTimer--;
    }
  }

  function drawGrowthPopup() {
    if (growthPopupState === "NONE") return;
    push(); let w = 220; let h = 60; let x = GW/2 - w/2; let y = 50; let a = growthPopupAlpha;
    noStroke(); fill(0, a * 0.7); rect(x, y, w, h, 12);
    stroke(80, 255, 180, a); strokeWeight(2); noFill(); rect(x, y, w, h, 12);
    noStroke(); fill(80, 255, 180, a); textAlign(CENTER, CENTER); textSize(20); text(growthGainMessage, GW/2, y + h/2);
    pop();
  }
  
  drawImageButton(stopBtnImg, GW - 220, 15, 95, 40);

  if(eventActive){ drawEventCard(); }
  else if(isPaused){
    noStroke(); fill(0,180); rect(0,0,GW,GH);
    drawTextWithOutline("일시 정지", GW/2, GH/2 - 40, 40, CENTER, CENTER);
    drawCanvasButton(GW/2 - 110, GH/2 + 20, 100, 45, "▶ 계속하기", 16);
    drawCanvasButton(GW/2 + 10, GH/2 + 20, 100, 45, "메인메뉴", 16);
  }

  let camW = 100; let camH = 75; let camX = GW - camW - 15; let camY = 70; 
  push(); drawingContext.save(); drawingContext.beginPath(); drawingContext.roundRect(camX, camY, camW, camH, 15); drawingContext.clip();
  translate(camX + camW, camY); scale(-1, 1); image(video, 0, 0, camW, camH);
  drawingContext.restore(); pop();

  noFill(); stroke(255); strokeWeight(4); rect(camX, camY, camW, camH, 15);
  if(growthGainTimer > 0){ drawGrowthPopup(); growthGainTimer--; }
}

function spawnItem() {
  let itemType = "";
  if (gameMode === "STORY") {
    if (currentStage === 1) itemType = "기본";
    else if (currentStage === 2) {
      let r = random(1);
      if (r < 0.33) itemType = "컴퓨터";
      else if (r < 0.66) itemType = "음악";
      else itemType = "책";
    } else if (currentStage === 3) {
      if (random(1) < 0.5) itemType = "직업전용";
      else itemType = "술담배";
    }
  } 
  else if (gameMode === "CHALLENGE") {
    if (random(1) < 0.5) itemType = "회복";
    else itemType = "장애물";
  }
  items.push(new Item(itemType));
}

function drawEndingScreen() {
  if (gameMode === "STORY") {
    if (!endingCalculated) {
      calculateEnding();
      endingCalculated = true;
      if (mainTheme01 && mainTheme01.isPlaying()) mainTheme01.stop();
      if (runningSound && runningSound.isPlaying()) runningSound.stop();
      if (endingSong && !endingSong.isPlaying()) endingSong.loop(); 
    }
  } else {
    if (!endingCalculated) {
      highScores.push(challengeScore); highScores.sort((a, b) => b - a); highScores = highScores.slice(0, 5);
      localStorage.setItem('faceControlHighScores', JSON.stringify(highScores));
      endingCalculated = true;
      if (mainTheme01 && mainTheme01.isPlaying()) mainTheme01.stop();
      if (runningSound && runningSound.isPlaying()) runningSound.stop();
    }
  }

  noStroke(); fill(0, 200); rect(0, 0, GW, GH);

  if (gameMode === "STORY") {
    drawTextWithOutline(endingTitle, GW / 2, 80, 45, CENTER, CENTER, color(255, 215, 0));
    drawTextWithOutline(endingDescription, GW / 2, 140, 22, CENTER, CENTER, color(255));
    drawTextWithOutline(`[ 내 인생 기록부 ]`, GW / 2 - 120, 220, 22, LEFT, CENTER, color(150, 255, 255));
    drawTextWithOutline(`웃은 횟수: ${smileStack} 번`, GW / 2 - 120, 260, 20, LEFT, CENTER);
    drawTextWithOutline(`입 벌린 횟수: ${openMouthStack} 번`, GW / 2 - 120, 290, 20, LEFT, CENTER);
    drawTextWithOutline(`총 표정 변화량: ${smileStack + openMouthStack} (20 이상시 역동적인 삶)`, GW / 2 - 120, 320, 20, LEFT, CENTER);
    drawTextWithOutline(`술/담배 습득량: ${itemScores["술담배"]}`, GW / 2 - 120, 350, 20, LEFT, CENTER, color(255, 100, 100));
  } 
  else {
    drawTextWithOutline("게임 오버!", GW / 2, 70, 50, CENTER, CENTER, color(255, 100, 100));
    drawTextWithOutline(`최종 생존 거리: ${challengeScore} M`, GW / 2, 130, 24, CENTER, CENTER, color(200, 255, 200));
    drawTextWithOutline("도전 모드 명예의 전당", GW / 2, 190, 26, CENTER, CENTER, color(255, 215, 0));
    for (let i = 0; i < 5; i++) {
      let scoreText = highScores[i] > 0 ? `${highScores[i]} M` : "-";
      let yPos = 230 + (i * 35);
      let tColor = color(255);
      if (isNewRecord && highScores[i] === challengeScore) tColor = color(255, 255, 100);
      drawTextWithOutline(`${i + 1}위 :  ${scoreText}`, GW / 2, yPos, 22, CENTER, CENTER, tColor);
    }
  }
  drawCanvasButton(GW / 2 - 100, 420, 200, 45, "메인화면으로 이동", 20);
}

function calculateEnding() {
  let totalExpressions = smileStack + openMouthStack;
  if (itemScores["술담배"] >= 10) { endingTitle = `일찍 죽은 ${chosenJob}`; endingDescription = "성년기에 건강 관리를 하지 못해 조기 사망했습니다..."; } 
  else if (totalExpressions < 20) { endingTitle = `평범하게 산 ${chosenJob}`; endingDescription = "큰 풍파 없이 무난하고 안정적인 삶을 추구하며 살았습니다."; } 
  else {
    if (openMouthStack > smileStack * 2) { endingTitle = `망한 ${chosenJob}`; endingDescription = "너무 많은 욕심을 부리다 모든 것을 잃고 배드엔딩을 맞이했습니다."; } 
    else {
      endingTitle = `행복한 ${chosenJob}`;
      if (smileStack >= openMouthStack) { endingDescription = "밝은 성격 덕분에 주변에 사람이 많고 행복한 삶을 살았습니다!"; } 
      else { endingDescription = "적극적인 성격으로 다양한 경험을 쌓으며 멋진 삶을 살았습니다!"; }
    }
  }
}

function drawEventCard(){
  fill(0,180); rect(0,0,GW,GH);
  fill(255); rect(60,60,520,320,20);
  drawTextWithOutline(currentEvent.title, GW/2, 95, 30, CENTER);
  drawThinText(currentEvent.description, GW/2, 140, 18, CENTER, TOP, color(0));
  let btnW = 120; let gap = 40; let totalW = currentEvent.options.length * btnW + (currentEvent.options.length - 1) * gap;
  let startX = GW / 2 - totalW / 2;
  for (let i = 0; i < currentEvent.options.length; i++) {
    let x = startX + i * (btnW + gap);
    drawCanvasButton(x, 220, btnW, 60, currentEvent.options[i].name, 14);
  }
}

function resetGameValues() {
  player = new Player();
  items = []; particles = [];
  currentStage = 1; itemSpawnTimer = 0; smileStack = 0; openMouthStack = 0;
  chosenJob = ""; endingCalculated = false; challengeScore = 0; challengeHP = 10;
  isPaused = false; gameFrame = 0; tutorialCompleteTime = 0;
  isNewRecord = false; newRecordAnimTimer = 0; currentHighScore = highScores[0] || 0;
  for (let key in itemScores) itemScores[key] = 0;
  bgX = 0;
  if (runningSound && runningSound.isPlaying()) runningSound.stop();
}

function mousePressed() {
  if (getAudioContext().state !== 'running') {
    userStartAudio();
  }
  if (gameState !== "ENDING" && mainTheme01 && !mainTheme01.isPlaying()) {
    mainTheme01.loop();
  }

  clickEffects.push({ x: mouseXScaled, y: mouseYScaled, r: 0, alpha: 255 });

  if (transitionState !== "NONE") return;

  let isClicked = (bx, by, bw, bh) => mouseXScaled > bx && mouseXScaled < bx + bw && mouseYScaled > by && mouseYScaled < by + bh;

  if (isClicked(GW - 110, 15, 95, 40)) {
    fullscreen(!fullscreen());
    return;
  }

  if (gameState === "MAIN_MENU") {
    let btnW = 200; let btnH = 60; let btnX = GW / 2 - btnW / 2; let btnY = GH / 2 + 50;
    if (isClicked(btnX, btnY, btnW, btnH)) { changeState("MODE_SELECT"); }
    return;
  }

  if (gameState === "MODE_SELECT") {
    if (isClicked(GW / 2 - 220, 200, 200, 100)) { gameMode = "STORY"; resetGameValues(); changeState("SETTINGS"); return; }
    if (isClicked(GW / 2 + 20, 200, 200, 100)) { gameMode = "CHALLENGE"; resetGameValues(); changeState("CHAR_SELECT"); return; }
    if (isClicked(15, 15, 95, 40)) { changeState("MAIN_MENU"); }
    return;
  }

  if (gameState === "CHAR_SELECT") {
    let chars = ["아기", "청소년", "의사", "개발자", "가수"];
    for (let i = 0; i < chars.length; i++) {
      let x = GW / 2 - 250 + i * 100;
      if (isClicked(x, 200, 80, 80)) { challengeChar = chars[i]; changeState("SETTINGS"); return; }
    }
    if (isClicked(15, 15, 95, 40)) { changeState("MODE_SELECT"); }
    return;
  }

  if (gameState === "SETTINGS") {
    if (isClicked(15, 15, 95, 40)) {
      if (gameMode === "STORY") changeState("MODE_SELECT");
      else changeState("CHAR_SELECT");
      return;
    }
    if (isClicked(240, 215, 40, 30)) smileThresh -= 2;
    if (isClicked(340, 215, 40, 30)) smileThresh += 2;
    if (isClicked(240, 335, 40, 30)) mouthThresh -= 1;
    if (isClicked(340, 335, 40, 30)) mouthThresh += 1;
    if (isClicked(GW / 2 - 120, 420, 240, 45)) { changeState("TUTORIAL"); }
    return;
  }

  if (gameState === "TUTORIAL") {
    let skipW = 140;
    let skipH = tutorialSkipBtnImg ? skipW * (tutorialSkipBtnImg.height / tutorialSkipBtnImg.width) : 40;
    if (isClicked(GW - skipW - 20, GH - skipH - 20, skipW, skipH)) {
      changeState("PLAYING");
    }
    return;
  }

  if (gameState === "PLAYING") {
    if (eventActive) {
      for (let i = 0; i < currentEvent.options.length; i++) {
        let x = 80 + i * 160;
        if (isClicked(x, 220, 120, 60)) {
          let option = currentEvent.options[i];
          let popupMsg = "";
          
          // ✅ 이벤트 옵션 선택 시 사운드 한 번 재생
          if (eventGetSound) eventGetSound.play();
          
          if (currentStage === 1) { 
            // 10점 만점 단위 스케일 조정 적용 (보상 나누기 10)
            itemScores["기본"] += option.reward / 10; 
            popupMsg = "성장 +" + option.reward; 
          } 
          else if (currentStage === 2) {
            let isStudy = option.name.includes("공부") || option.name.includes("책");
            let isCoding = option.name.includes("컴퓨터") || option.name.includes("개발") || option.name.includes("게임");
            let isMusic = option.name.includes("음악");
            
            let inc = option.reward / 10;
            let added = false;
            
            // 키워드에 따라 개별적으로 게이지 증가
            if (isStudy) { itemScores["책"] += inc; popupMsg = "학구열 +" + option.reward; added = true; }
            if (isCoding) { itemScores["컴퓨터"] += inc; popupMsg = "코딩 적성 +" + option.reward; added = true; }
            if (isMusic) { itemScores["음악"] += inc; popupMsg = "음악성 +" + option.reward; added = true; }
            
            // 아무것도 매칭되지 않으면 3가지 모두 증가
            if (!added) {
              itemScores["책"] += inc;
              itemScores["컴퓨터"] += inc;
              itemScores["음악"] += inc;
              popupMsg = "전체 능력치 +" + option.reward;
            }
          } 
          else if (currentStage === 3) {
            itemScores["직업전용"] += option.reward; 
            popupMsg = "인생 성공 +" + (option.reward * 5); // 기존 체감 유지
          }
          
          checkLevelUp(); // 증가 후 바로 레벨업/엔딩 체크

          showGrowthPopup(popupMsg);
          eventActive = false; isPaused = false; 
          return;
        }
      }
    }
    
    if (isPaused) {
      if (isClicked(GW / 2 - 110, GH / 2 + 20, 100, 45)) { isPaused = false; if (mainTheme01 && !mainTheme01.isPlaying()) mainTheme01.play(); return; }
      if (isClicked(GW / 2 + 10, GH / 2 + 20, 100, 45)) { 
        if (runningSound && runningSound.isPlaying()) runningSound.stop();
        changeState("MAIN_MENU"); 
        return; 
      }
    } 
    else {
      if (isClicked(GW - 220, 15, 95, 40)) { isPaused = true; if (mainTheme01 && mainTheme01.isPlaying()) mainTheme01.pause(); return; }
    }
    return;
  }

  if (gameState === "ENDING") {
    if (isClicked(GW / 2 - 100, 420, 200, 45)) {
      if (endingSong && endingSong.isPlaying()) endingSong.stop();
      changeState("MAIN_MENU");
    }
  }
}

function keyPressed() {
  if (key === 'f' || key === 'F') { fullscreen(!fullscreen()); }
}

// ✅ [동기화 코드] 좌측 하단 게이지를 그릴 때 1, 2, 3 단계에 맞춰 동적으로 생성
function drawStageGauge() {
  let drawBar = (label, progress, maxVal, col, x, y, w, h) => {
    progress = min(progress, maxVal);
    noStroke(); fill(50, 200); rect(x, y, w, h, 15);
    let fillW = map(progress, 0, maxVal, 0, w);
    fill(col); rect(x, y, fillW, h, 15);
    stroke(255); strokeWeight(3); noFill(); rect(x, y, w, h, 15);
    
    let tSize = h < 20 ? 12 : 16;
    drawTextWithOutline(`${label} : ${Math.floor(progress)} / ${maxVal}`, x + w/2, y + h/2 - (h<20?2:0), tSize, CENTER, CENTER);
  };

  if (currentStage === 1) { 
    drawBar("성장 게이지", itemScores["기본"], 10, color(100, 200, 255), 20, GH - 50, 220, 25);
  } 
  else if (currentStage === 2) { 
    // 청소년기는 3개의 게이지 바 출력
    drawBar("코딩 게이지", itemScores["컴퓨터"], 10, color(100, 255, 100), 20, GH - 75, 200, 18);
    drawBar("음악 게이지", itemScores["음악"], 10, color(255, 150, 200), 20, GH - 50, 200, 18);
    drawBar("공부 게이지", itemScores["책"], 10, color(100, 150, 255), 20, GH - 25, 200, 18);
  } 
  else if (currentStage === 3) { 
    drawBar("인생 성공", itemScores["직업전용"], 20, color(100, 255, 120), 20, GH - 50, 220, 25);
    drawBar("위험", itemScores["술담배"], 10, color(255, 60, 60), 280, GH - 50, 220, 25);
  }
}

// --- 클래스들 ---
class Player {
  constructor() {
    this.x = 100; this.y = groundY; this.size = 40; this.vy = 0; this.gravity = 0.8; this.jumpPower = -12; this.jumpCount = 0; 
  }
  
  jump() {
    if (this.jumpCount === 0) { 
      this.vy = this.jumpPower; 
      this.jumpCount = 1; 
      spawnDust(this.x + this.size/2, this.y, 10); 
      if (jumpSound) jumpSound.play();
    }
  }
  
  doubleJump() {
    if (this.jumpCount <= 1) { 
      this.vy = this.jumpPower * 1.2; 
      this.jumpCount = 2; 
      spawnDust(this.x + this.size/2, this.y, 15); 
      if (jumpSound) jumpSound.play();
    }
  }
  
  update() {
    this.vy += this.gravity;
    this.y += this.vy;
    
    if (this.y >= groundY) { 
      this.y = groundY; this.vy = 0; this.jumpCount = 0; 
      if (gameFrame % 10 === 0) { spawnDust(this.x + this.size/2, this.y, 3); }
    }

    if (gameFrame % 12 === 0) {
      if (gameMode === "STORY") {
        if (currentStage === 1 && babyAnimationFrames.length > 0) currentBabyFrame = (currentBabyFrame + 1) % babyAnimationFrames.length;
        else if (currentStage === 2 && boyAnimationFrames.length > 0) currentBoyFrame = (currentBoyFrame + 1) % boyAnimationFrames.length;
        else if (currentStage === 3) {
          if (chosenJob === "개발자" && devAnimationFrames.length > 0) currentDevFrame = (currentDevFrame + 1) % devAnimationFrames.length;
          else if (chosenJob === "가수" && musAnimationFrames.length > 0) currentMusFrame = (currentMusFrame + 1) % musAnimationFrames.length;
          else if (chosenJob === "의사" && docAnimationFrames.length > 0) currentDocFrame = (currentDocFrame + 1) % docAnimationFrames.length;
        }
      } else if (gameMode === "CHALLENGE") {
        if (challengeChar === "아기") currentBabyFrame = (currentBabyFrame + 1) % babyAnimationFrames.length;
        else if (challengeChar === "청소년") currentBoyFrame = (currentBoyFrame + 1) % boyAnimationFrames.length;
        else if (challengeChar === "개발자") currentDevFrame = (currentDevFrame + 1) % devAnimationFrames.length;
        else if (challengeChar === "가수") currentMusFrame = (currentMusFrame + 1) % musAnimationFrames.length;
        else if (challengeChar === "의사") currentDocFrame = (currentDocFrame + 1) % docAnimationFrames.length;
      }
    }
  }
  
  display() {
    let img = null; let targetSize = 40;

    if (gameMode === "STORY") {
      if (currentStage === 1) { img = babyAnimationFrames[currentBabyFrame]; targetSize = 40; }
      else if (currentStage === 2) { img = boyAnimationFrames[currentBoyFrame]; targetSize = 120; }
      else if (currentStage === 3) {
        targetSize = 120;
        if (chosenJob === "개발자") img = devAnimationFrames[currentDevFrame];
        else if (chosenJob === "가수") img = musAnimationFrames[currentMusFrame];
        else if (chosenJob === "의사") img = docAnimationFrames[currentDocFrame];
      }
    } else if (gameMode === "CHALLENGE") {
      if (challengeChar === "아기") { img = babyAnimationFrames[currentBabyFrame]; targetSize = 40; }
      else if (challengeChar === "청소년") { img = boyAnimationFrames[currentBoyFrame]; targetSize = 120; }
      else {
        targetSize = 120;
        if (challengeChar === "개발자") img = devAnimationFrames[currentDevFrame];
        else if (challengeChar === "가수") img = musAnimationFrames[currentMusFrame];
        else if (challengeChar === "의사") img = docAnimationFrames[currentDocFrame];
      }
    }

    this.size = targetSize;
    if (img) {
      let ratio = img.width / img.height; let drawHeight = this.size; let drawWidth = this.size * ratio; let offsetX = (this.size - drawWidth) / 2;
      image(img, this.x + offsetX, this.y - drawHeight, drawWidth, drawHeight);
    } else {
      noStroke(); fill(255, 204, 0); rect(this.x, this.y - this.size, this.size, this.size, 10); 
    }
  }
}

class Item {
  constructor(type) {
    this.type = type; this.img = null; this.x = GW + 30; this.speed = 5; 
    
    if (gameMode === "STORY") {
      if (currentStage === 1) { this.size = 25; this.baseY = groundY - random(80, 120); }
      else if (currentStage === 2 || currentStage === 3) { this.size = (currentStage === 2) ? 25 : 32.5; this.baseY = groundY - random(180, 260); }
      
      if (this.type === "기본") this.img = random([babyItem01, babyItem02]); 
      else if (this.type === "컴퓨터") this.img = laptopItem;
      else if (this.type === "음악") this.img = musicItem;
      else if (this.type === "책") this.img = studyItem;
      else if (this.type === "직업전용") { if (chosenJob === "개발자") this.img = devItem; else if (chosenJob === "가수") this.img = musItem; else if (chosenJob === "의사") this.img = docItem; } 
      else if (this.type === "술담배") this.img = damageItem;
    } 
    else if (gameMode === "CHALLENGE") {
      if (this.type === "장애물") { this.size = 25; this.baseY = groundY - this.size / 2; this.img = null; } 
      else if (this.type === "회복") {
        this.size = 25; 
        if (challengeChar === "아기") this.baseY = groundY - random(80, 120); else this.baseY = groundY - random(180, 260); 
        if (challengeChar === "아기") this.img = random([babyItem01, babyItem02]); 
        else if (challengeChar === "청소년") this.img = random([laptopItem, musicItem, studyItem]);
        else if (challengeChar === "의사") this.img = docItem; else if (challengeChar === "개발자") this.img = devItem; else if (challengeChar === "가수") this.img = musItem;
      }
    }
    this.y = this.baseY; 
  }
  
  update() {
    this.x -= this.speed;
    if (this.type !== "장애물") { this.y = this.baseY + sin((gameFrame * 0.1) + (this.x * 0.02)) * 6; }
  }
  
  display() {
    if (this.type !== "장애물") { fill(255, 200); stroke(255, 255, 200, 150); strokeWeight(3); ellipse(this.x, this.y, this.size * 2); noStroke(); }
    if (this.img) {
      let ratio = this.img.width / this.img.height; let drawH = this.size * 1.2; let drawW = drawH * ratio;
      image(this.img, this.x - drawW / 2, this.y - drawH / 2, drawW, drawH);
    } else {
      if (this.type === "회복") { noStroke(); fill(100, 255, 100); ellipse(this.x, this.y, this.size); } 
      else if (this.type === "장애물") {
        noStroke(); fill(255, 50, 50); triangle(this.x, this.y - this.size, this.x - this.size*0.8, this.y + this.size*0.8, this.x + this.size*0.8, this.y + this.size*0.8);
        drawTextWithOutline("위험", this.x, this.y + 12, 12, CENTER, CENTER);
      } else { noStroke(); fill(200); ellipse(this.x, this.y, this.size); drawTextWithOutline(this.type.substring(0,2), this.x, this.y, 10, CENTER, CENTER); }
    }
  }
}
