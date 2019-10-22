// -------------------- Define Constants --------------------

// Keycodes
const WKEY = 87;
const AKEY = 65;
const SKEY = 83;
const DKEY = 68;
const SPACE = 32;
const SHIFT = 16;

var GAME_WIDTH = 400;
var GAME_HEIGHT = 400;
var GAME_SCALE = 1;

var PLAYERSPEED = 5;

// -------------------- Main code --------------------

// ---------- Define global variables
var fps = 60;

// The game's state which will track which screen the game is one as well as
// determine which functions are run during the game loop
var gameState;

// Global variables to track which key(s) are being pressed
var wDown = false;
var aDown = false;
var sDown = false;
var dDown = false;

// global arrays to store references to game Objects
// these will be filled, emptied, and modified as new screens are loaded
var player;

// A reference to the tile world that will be used by several functions
var world;

// a reference to the spritesheet which will be updated as new screens are loaded


// a reference to the main theme's audio file

// global cycle used to change food objects

// ---------- PIXI.js boiler plate code
var gameport = document.getElementById("gameport");

var renderer = PIXI.autoDetectRenderer({width: GAME_WIDTH, height: GAME_HEIGHT,
                                        backgroundColor: 0xa66407});
gameport.appendChild(renderer.view);

var stage = new PIXI.Container();
stage.scale.x = GAME_SCALE;
stage.scale.y = GAME_SCALE;



// -------------------- Main PIXI Containers --------------------
// Create the main states of the game and add them to the stage

console.log("Start container definition");

console.log("Finish container definition");



// -------------------- Initialization --------------------

console.log("Start initialization");

PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

// Load sprite sheet with all game's sprites
PIXI.loader.add("map.json").add("tileset.png").load( initializeSprites );

// Create the sprites that will be used in every biome
// The large title, help, and game over screen sprites are bigger than this whole
// sheet and so are loaded seperately.
function initializeSprites()
{
  // Initialize tile utilities
  var tu = new TileUtilities( PIXI );

  // Get a reference to the tile map and add it to the stage
  world = tu.makeTiledWorld("map.json", "tileset.png");
  stage.addChild(world);

  // Create the player
  player = new player();

  // Add player to map's entity layer
  var entity_layer = world.getObject("Entities");
  entity_layer.addChild(player.sprite);
}

// -------------------- Objects --------------------

function player()
{
  // Get a reference to the player object in the entities layer of the map
  var stgPlayer = world.getObject("Player");

  // Create the player's sprite
  this.sprite = new PIXI.Sprite( new PIXI.Texture.from("Assets/Player.png") );
  this.sprite.x = stgPlayer.x;
  this.sprite.y = stgPlayer.y;
  this.sprite.anchor.set(0.5);

  // Instance variables
  this.moving = false;
}

// -------------------- Define Functions --------------------

// ---------- Helper functions

// Calculates the distance in pixles between two given points
function distance( x1, y1, x2, y2)
{
  return Math.sqrt( Math.pow( x1 - x2, 2 ) + Math.pow( y1 - y2, 2 ) );
}

// ---------- Screen loading functions
// ---------- Input handlers
function keydownEventHandler(e)
{
  // When a key is pressed, update the appropriate global variable to track
  // the key press
  if (e.keyCode == WKEY) {
    wDown = true;
  }
  if (e.keyCode == SKEY) {
    sDown = true;
  }
  if (e.keyCode == AKEY) {
    aDown = true;
  }
  if (e.keyCode == DKEY) {
    dDown = true;
  }
}

function keyupEventHandler(e)
{
  // When a key is released, update the appropriate global variable to track
  // the key being released
  if (e.keyCode == WKEY) {
    wDown = false;
  }
  if (e.keyCode == SKEY) {
    sDown = false;
  }
  if (e.keyCode == AKEY) {
    aDown = false;
  }
  if (e.keyCode == DKEY) {
    dDown = false;
  }
}

document.addEventListener('keydown', keydownEventHandler);
document.addEventListener('keyup', keyupEventHandler);


function movePlayer()
{
  // Move player
  if (wDown) { // W key
    player.sprite.y -= PLAYERSPEED;
  }

  if (sDown) { // S key
    player.sprite.y += PLAYERSPEED;
  }

  if (aDown) { // A key
    player.sprite.x -= PLAYERSPEED;
  }

  if (dDown) { // D key
    player.sprite.x += PLAYERSPEED;
  }
}

function update_camera() {
  stage.x = -player.sprite.x*GAME_SCALE + GAME_WIDTH/2 - player.sprite.width/2*GAME_SCALE;
  stage.y = -player.sprite.y*GAME_SCALE + GAME_HEIGHT/2 + player.sprite.height/2*GAME_SCALE;
  stage.x = -Math.max(0, Math.min(world.worldWidth*GAME_SCALE - GAME_WIDTH, -stage.x));
  stage.y = -Math.max(0, Math.min(world.worldHeight*GAME_SCALE - GAME_HEIGHT, -stage.y));
}

function bound( sprite )
{
  // Given a sprite, make sure that it stays within the bounds of the screen
  if( sprite.position.x < 0 )
  {
    sprite.position.x = 0;
  }
  else if( sprite.position.x > 600 )
  {
    sprite.position.x = 600;
  }
  if( sprite.position.y < 0 )
  {
    sprite.position.y = 0;
  }
  else if( sprite.position.y > 600 )
  {
    sprite.position.y = 600;
  }
}

function boundObjects()
{
  // Keep players and enemies from moving off of the screen

}



// -------------------- Main game loop --------------------
function gameLoop()
{
  setTimeout( function()
  {
    requestAnimationFrame(gameLoop);

    movePlayer();
    update_camera();

    renderer.render(stage);
  }, 1000 / fps );
}

gameLoop();
