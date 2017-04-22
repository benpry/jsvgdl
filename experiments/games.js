//http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
  var currentIndex = array.length
  var temporaryValue = 0
  var randomIndex = 0;
  var array = array.slice();

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

/**
Simple interactions: get/lose points, can't pass through walls, object gets pushed.
**/
function Games () {
    that = Object.create(Games.prototype);

    var games = {
dodge : {
    levels : [`
wwwwwwwwwwwwwwwwwww
wA  w  <  -      Gw
w   w-            w
w            ww   w
w   < w ^      w  w
w ^   w   V    V ww
w   -        v    w
ww   <    www     w
w                 w
www     v       www
wwwwwwwwwwwwwwwwwww`],
    
    game: `
BasicGame
    SpriteSet
        bullet > Missile
            slowbullet > speed=0.1 color=ORANGE
                upslow    >     orientation=UP    
                downslow  >     orientation=DOWN  
                leftslow  >     orientation=LEFT  
                rightslow >     orientation=RIGHT
            fastbullet > speed=0.2  color=RED
                rightfast >     orientation=RIGHT
                downfast  >     orientation=DOWN  
        wall      > Immovable
        goal      > Immovable  color=GREEN
        
    InteractionSet
        goal   avatar > killSprite
        avatar bullet > killSprite
        avatar wall   > stepBack
        bullet EOS    > wrapAround
    
    TerminationSet
        SpriteCounter stype=goal   limit=0 win=True
        SpriteCounter stype=avatar limit=0 win=False
    
    LevelMapping
        ^ > upslow
        < > leftslow
        v > downslow
        - > rightslow
        = > rightfast
        V > downfast
        G > goal`,

},

aliens : {
    levels : [`
wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww
w                              w
w1                             w
w000                           w
w000                           w
w                              w
w                              w
w                              w
w                              w
w    000      000000     000   w
w   00000    00000000   00000  w
w   0   0    00    00   00000  w
w                A             w
wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww
`],
    game : `
BasicGame
    SpriteSet
        base    > Immovable    color=WHITE
        avatar  > FlakAvatar stype=sam
        missile > Missile
            sam  > orientation=UP    color=BLUE singleton=True
            bomb > orientation=DOWN  color=RED  speed=0.5
        alien   > Bomber       stype=bomb   prob=0.3  cooldown=3 speed=0.75
        portal  > SpawnPoint   stype=alien  cooldown=1   total=3
    
    LevelMapping
        0 > base
        1 > portal

    TerminationSet
        SpriteCounter      stype=avatar               limit=0 win=False
        MultiSpriteCounter stype1=portal stype2=alien limit=0 win=True
        
    InteractionSet
        avatar  wall  > stepBack
        alien   wall  > turnAround        
        missile wall  > killSprite
        missile base > killSprite
        base missile > killSprite
        base   alien > killSprite
        avatar alien > killSprite
        avatar bomb  > killSprite
        alien  sam   > killSprite     
`
    },
prediction1 : {
    levels :[`
wwwwwwwwwwwwwwwwwwwwwwwww
w 1                     w
w     c                 w
w   A            a      w
w  3                    w
w      2                w
w             b         w
w                  4    w
w          1            w
w                       g
wwwwwwwwwwwwwwwwwwwwwwwww
`],
    game : `
BasicGame frame_rate=30
    SpriteSet        
        box > Passive
            box1 > color=RED
            box2 > color=LIGHTBLUE
            box3 > color=PURPLE
        wall > ResourcePack color=BLACK  
        missile > Missile orientation=RIGHT
            missile1 > color=YELLOW speed=0.2
            missile2 > color=GREEN   speed=0.2
            missile3 > color=PINK   speed=0.1       
            missile4 > color=ORANGE  speed=0.1
        goal > Immovable color=BLACK
        avatar > MovingAvatar color=WHITE
    LevelMapping
        w > wall   
        a > box1
        b > box2
        c > box3
        1 > missile1
        2 > missile2
        3 > missile3
        4 > missile4
        g > goal
        A > avatar
    InteractionSet
        avatar wall > stepBack  
        box avatar > killSprite  
        missile wall > reverseDirection
        missile avatar > killSprite 
        goal avatar > killSprite
    TerminationSet
        SpriteCounter stype=avatar  limit=0 win=False          
        SpriteCounter stype=goal limit=0 win=True
`
    },
prediction2 : {
    levels : [`
wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww
w      w          w                 w
w      w       b  w         w       w
w   a  w          w         w  y    w
w      w                    w       w
w      w          w         w       w
w      w          w         w       w
w                 w     z   w       w
w      wwww wwwwwwwwwwwwwww wwwwwwwww
w wwwwww               w            w
w      w         2     w            w
w   A  w               w      1     w
w      w               w            w
w      w               w            g
wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww
`],
game : `
BasicGame frame_rate=30
    SpriteSet
        box > Passive
            box1 > color=RED
            box2 > color=LIGHTGREEN
        mover > VGDLSprite
            rand > RandomNPC cooldown=10
                rand1 > color=LIGHTORANGE
                rand2 > color=BLUE
        wall > ResourcePack color=BLACK  
        missile > Missile
            missile1 > color=YELLOW speed=0.2 orientation=UP
            missile2 > color=PINK   speed=0.2 orientation=RIGHT
        goal > Immovable color=BLACK
    LevelMapping
        w > wall   
        a > box1
        b > box2
        x > chaser
        y > rand1
        z > rand2
        1 > missile1
        2 > missile2
        g > goal
    InteractionSet
        avatar wall > stepBack 
        mover wall > stepBack
        box avatar > killSprite  
        missile wall > reverseDirection
        missile avatar > killSprite
        missile missile > reverseDirection
        mover avatar > undoAll
        mover mover > stepBack
        mover missile > stepBack
        mover box > stepBack
        goal avatar > killSprite
    TerminationSet
        SpriteCounter stype=avatar  limit=0 win=False          
        SpriteCounter stype=goal limit=0 win=True
`
},

prediction3 : {
    levels : [`
wwwwwwwwwwwwwwwwwwwwwwwwww
wA                       w
w    a             a     w
w     a              a   w
w                        w
w     x            z     w
w   x   x        z   z   w
w                        w
w                        w
w                        w
w      xa        az      w
w                        w
w                        w
w                        w
w          a y           w
w                        w
w                        g
wwwwwwwwwwwwwwwwwwwwwwwwww`],

    game : `
BasicGame frame_rate=30
    SpriteSet
        probe > Immovable color=BLUE
        converter > Immovable 
            converter1 > color=RED
            converter2 > color=PURPLE
        box > Immovable
            box_a >
                box1 > color=GRAY
                box2 > color=ORANGE
                box3 > color=LIGHTGREEN
            box_b >        
                box4 > color=LIGHTBLUE
                box5 > color=PINK
                box6 > color=YELLOW       
        goal > Immovable color=BLACK  
        avatar > MovingAvatar color=WHITE
        wall > Immovable color=DARKGRAY
    LevelMapping
        w > wall   
        a > box1
        b > box2
        c > box3
        d > box4
        e > box5
        f > box6
        x > probe
        z > converter1
        y > converter2
        g > goal
    InteractionSet
        avatar wall > stepBack
        avatar box6 > undoAll 
        box avatar > bounceForward
        box probe > undoAll
        box box > undoAll
        box wall > undoAll
        converter box > bounceForward
        probe avatar > killSprite
        converter avatar > transformTo stype=box6
        avatar converter > undoAll
        goal avatar > killSprite
    TerminationSet
        SpriteCounter stype=avatar  limit=0 win=False          
        SpriteCounter stype=goal limit=0 win=True`
},

prediction4 : {
    levels : [`
wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww
w A                                 w
w                o                  w
w                                   w
w                                   w
w                                   w
w   2                      2   2    w
w     i                      p      w
w   1                      1   1    w
w                                   w
w                                   w
w                                   w
w                3                  w
w                                   g
wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww`],

    game : `
BasicGame
    SpriteSet
        structure > Immovable            
            portalentry > Portal 
                entry1 > stype=exit1 color=GRAY 
            portalexit  > color=BROWN
                exit1  > Immovable
        box > Immovable
            box_a > color=BLUE
            box_b > Immovable
                box_b1 >color=RED
                box_b2 >color=PURPLE
        probe > Immovable color=YELLOW
        goal > Immovable color=BLACK
        avatar > MovingAvatar color=WHITE
    InteractionSet
        goal   avatar    > killSprite
        avatar wall      > stepBack
        box avatar > bounceForward
        avatar portalentry > teleportToExit
        box_a portalentry > teleportToExit
        box_b portalentry > undoAll
        box_a probe > killSprite
        probe box_b > bounceForward
        box box > undoAll
        box wall > undoAll
    TerminationSet
        SpriteCounter stype=avatar limit=0 win=False
        SpriteCounter stype=goal limit=0 win=True

    LevelMapping
        1 > box_a
        2 > box_b1
        3 > box_b2
        i > entry1
        o > exit1
        p > probe  
        g > goal   `
},

prediction5 : {
    levels : [`
wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww
w      w          w                 w
w      w       c  w         w       w
w   a  w          w         w  y    w
w      w                    w       w
w      w          w         w       w
w      w          w         w       w
w                 w     z   w       w
w      wwww wwwwwwwwwwwwwww wwwwwwwww
w wwwwww               w            w
w      w         2     w            w
w   A  w               w      1     w
w      w               w            w
w      w               w            g
wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww`],
    game : `
BasicGame frame_rate=30
    SpriteSet
        box > Passive
            box1 > color=RED
            box2 > color=LIGHTBLUE
            box3 > color=LIGHTGREEN
        mover > VGDLSprite
            chaser > Chaser stype=avatar color=PINK cooldown=10
            rand > RandomNPC cooldown=10
                rand1 > color=LIGHTORANGE
                rand2 > color=BLUE
        wall > ResourcePack color=BLACK  
        missile > Missile
            missile1 > color=YELLOW speed=0.2 orientation=UP
            missile2 > color=GRAY   speed=0.2 orientation=UP
            missile3 > color=PINK   speed=0.2 orientation=RIGHT
            missile4 > color=GREEN  speed=0.1 orientation=RIGHT      
        goal > Immovable color=BLACK
    LevelMapping
        w > wall   
        a > box1
        b > box2
        c > box3
        x > chaser
        y > rand1
        z > rand2
        1 > missile1
        2 >missile3
        g > goal
    InteractionSet
        avatar wall > stepBack 
        mover wall > stepBack
        box avatar > killSprite  
        missile wall > reverseDirection
        missile avatar > killSprite
        missile missile > reverseDirection
        mover avatar > undoAll
        mover mover > stepBack
        mover missile > stepBack
        mover box > stepBack
        goal avatar > killSprite
    TerminationSet
        SpriteCounter stype=avatar  limit=0 win=False          
        SpriteCounter stype=goal limit=0 win=True`
},

simpleGame1 : {
    levels : [`
wwwwwwwwwwwww
w  2 m   w  w
w   1       w
w t Am1 p  gw
www  m hwwwww
w c  m  w   w
w 1  t     3w
w  2 c  p  ww
wwwwwwwwwwwww`],

    game : `
BasicGame frame_rate=30
    SpriteSet        
        hole   > ResourcePack color=LIGHTBLUE
        avatar > MovingAvatar color=DARKBLUE #cooldown=4 
        box    > ResourcePack 
            box1 > color=ORANGE
            box2 > color=PINK               
        treasure > ResourcePack color=GREEN limit=5
        goal > Passive color=GOLD
        trap > ResourcePack color=RED limit=5
        cloud > Passive color=BLUE
        medicine > Resource limit=3 color=WHITE
        poison > Resource limit=3 color=BROWN
        wall > Immovable color=BLACK      
        score > Resource color=PINK limit=10         
    LevelMapping
        0 > hole
        1 > box1
        3 > treasure 
        t > trap    
        c > cloud 
        m > medicine
        p > poison
        w > wall   
        g > goal 
        h > hole
    InteractionSet
        avatar wall > stepBack  
        hole avatar > killSprite
        treasure avatar > changeResource resource=score value=5
        treasure avatar > killSprite
        trap avatar > changeResource resource=score value=-5
        trap avatar > killSprite
        box trap > killSprite
        cloud avatar > killSprite
        avatar medicine > changeResource resource=medicine value=1
        medicine avatar > killSprite
        avatar poison > changeResource resource=medicine value=-1
        poison avatar > killSprite
        avatar poison > killIfHasLess resource=medicine limit=-1
        box avatar  > bounceForward
        box box > stepBack
        box wall    > stepBack      
        box hole    > killSprite
        box treasure > stepBack
        box poison > stepBack
        box medicine > stepBack
        goal avatar > killSprite
    TerminationSet
        SpriteCounter stype=box     limit=0 win=True
        SpriteCounter stype=goal    limit=0 win=True
        SpriteCounter stype=avatar  limit=0 win=False 
`
},

simpleGame2 : {
    levels : [`
wwwwwwwwwwwwwwwwwwwwwwwww
w m                  w  w
w2  1  3                w
w   A 1                gw
wwwn                wwwww
w c                 w   w
w 1 2       4           w
w    c             3   ww
wwwwwwwwwwwwwwwwwwwwwwwww
`],

    game : `
BasicGame frame_rate=30
    SpriteSet        
        breakbox   > ResourcePack 
            breakbox1 > color=LIGHTBLUE
        avatar > MovingAvatar color=DARKBLUE #cooldown=4 
        box    > ResourcePack 
            box1 > color=ORANGE               
            box2 > color=PINK
            box3 > color=RED
        goal > ResourcePack color=GOLD
        cloud > ResourcePack color=BLUE
        wall > ResourcePack color=BLACK  
        missile > Missile orientation=RIGHT speed=0.2
            missile1 > color=YELLOW
            missile2 > color=GRAY             
    LevelMapping
        0 > breakbox
        1 > box1
        2 > box2  
        3 > breakbox1
        4 > box3
        c > cloud 
        w > wall   
        g > goal 
        m > missile1
        n > missile2
    InteractionSet
        avatar wall > stepBack  
        breakbox avatar > killSprite
        cloud avatar > killSprite
        cloud box > killSprite
        box avatar  > bounceForward
        box wall    > undoAll        
        box box     > undoAll
        box breakbox    > killSprite
        goal avatar > killSprite  
        missile wall > reverseDirection
        missile avatar > killSprite 
        box missile > killSprite
    TerminationSet
        SpriteCounter stype=box     limit=0 win=True
        SpriteCounter stype=goal    limit=0 win=True
        SpriteCounter stype=avatar  limit=0 win=False  
`
},

simpleGame4 : {
    levels : [`
wwwwwwwww
w  1    w
w    p  w
w 2  wAww
w g  w ww
wwwwwwwww`,
`
wwwwwwwww
w  1    w
w    2  w
wAp  wgww
w    w ww
wwwwwwwww`,
`
wwwwwwwww
wA 1    w
w    2  w
w p  w ww
w   gw ww
wwwwwwwww`,
`
wwwwwwwww
w       w
w   A   w
w      ww
w g  w ww
wwwwwwwww`
],
    game : `
BasicGame frame_rate=30
    SpriteSet        
        avatar > MovingAvatar color=DARKBLUE #cooldown=4 
        goal > Passive color=GOLD
        poison > Resource limit=3 color=BROWN
        box1  > ResourcePack color=ORANGE
        box2 > ResourcePack color=BLUE
        wall > Immovable color=BLACK      
        score > Resource color=PINK limit=10         
    LevelMapping
        p > poison
        1 > box1
        2 > box2
        w > wall   
        g > goal 
        h > hole
    InteractionSet
        avatar wall > stepBack  
        poison avatar > killSprite
        avatar poison > killSprite
        goal avatar > killSprite
        box1 avatar  > bounceForward
        box2 avatar > killSprite
        goal box1 > bounceForward
        goal wall > undoAll
        goal poison > undoAll
        box1 wall    > undoAll    
        box1 poison > undoAll
    TerminationSet
        SpriteCounter stype=goal    limit=0 win=True
        SpriteCounter stype=avatar  limit=0 win=False  ` 
},

simpleGame4_big : {
    levels : [`
wwwwwwwwwwwwwwwwww
wA 1    p        w
w    2    p      w
w p       w  w gww
w    w 1     w  ww
wwwwwwwwwwwwwwwwww`],
    game : `
BasicGame frame_rate=30
    SpriteSet        
        avatar > MovingAvatar color=DARKBLUE #cooldown=4 
        goal > ResourcePack color=GOLD
        poison > ResourcePack limit=3 color=BROWN
        box1 > ResourcePack color=GREEN
        box2 > ResourcePack color=LIGHTBLUE
        wall > Immovable color=BLACK      
        score > Resource color=PINK limit=10  
        missile > Missile color=RED speed=.2      
    LevelMapping
        p > poison
        1 > box1
        2 > box2
        w > wall   
        g > goal 
        m > missile
    InteractionSet
        avatar wall > stepBack  
        missile wall > reverseDirection
        poison avatar > killSprite
        avatar poison > killSprite
        goal avatar > killSprite
        box1 avatar > bounceForward
        box2 avatar  > killSprite
        goal box1 > bounceForward
        goal box2 > bounceForward
        goal wall > undoAll
        goal poison > undoAll
        box1 wall    > undoAll    
        box2 wall    > undoAll    
        box1 poison > undoAll
        box2 poison > undoAll
    TerminationSet
        SpriteCounter stype=goal    limit=0 win=True
        SpriteCounter stype=avatar  limit=0 win=False`
},

simpleGame4_huge : {
    levels : [`
wwwwwwwwwwwwwwwwww
w  1    p        w
w    2    p      w
wAp       2  w  ww
w    w1      w  ww
ww         p     w
w   p     p    1 w
w    2       g   w
w        2       w
wwwwwwwwwwwwwwwwww`],
    game : `
BasicGame frame_rate=30
    SpriteSet        
        avatar > MovingAvatar color=DARKBLUE #cooldown=4 
        goal > ResourcePack color=GOLD
        poison > ResourcePack limit=3 color=BROWN
        box1 > ResourcePack color=GREEN
        box2 > ResourcePack color=LIGHTBLUE
        wall > Immovable color=BLACK      
        score > Resource color=PINK limit=10  
        missile > Missile color=RED speed=.2      
    LevelMapping
        p > poison
        1 > box1
        2 > box2
        w > wall   
        g > goal 
        m > missile
    InteractionSet
        avatar wall > stepBack  
        missile wall > reverseDirection
        poison avatar > killSprite
        avatar poison > killSprite
        goal avatar > killSprite
        box1 avatar > bounceForward
        box2 avatar  > killSprite
        goal box1 > bounceForward
        goal box2 > bounceForward
        goal wall > undoAll
        goal poison > undoAll
        box1 wall    > undoAll    
        box2 wall    > undoAll    
        box1 poison > undoAll
        box2 poison > undoAll
    TerminationSet
        SpriteCounter stype=goal    limit=0 win=True
        SpriteCounter stype=avatar  limit=0 win=False       `
},

simpleGame4_small : {
    levels : [`
wwwwwwwww
w  1    w
w Ap    w
w 2  wgww
w    w ww
wwwwwwwww
`],
    game : `
BasicGame frame_rate=30
    SpriteSet        
        avatar > MovingAvatar color=DARKBLUE #cooldown=4 
        goal > ResourcePack color=GOLD
        poison > ResourcePack limit=3 color=BROWN
        box  > ResourcePack 
            box1 > color=GREEN
            box2 > color=LIGHTBLUE
        wall > Immovable color=BLACK      
        score > Resource color=PINK limit=10  
    LevelMapping
        p > poison
        1 > box1
        2 > box2
        w > wall   
        g > goal 
    InteractionSet
        avatar wall > stepBack  
        missile wall > reverseDirection
        poison avatar > killSprite
        avatar poison > killSprite
        goal avatar > killSprite
        box1 avatar > bounceForward
        box2 avatar  > killSprite
        goal box > bounceForward
        goal wall > undoAll
        goal poison > undoAll
        box wall    > undoAll    
        box poison > undoAll
    TerminationSet
        SpriteCounter stype=goal    limit=0 win=True
        SpriteCounter stype=avatar  limit=0 win=False `
},

simpleGame5 : {
    levels : [`
wwwwwwwwwwwww
w     w     w
w     w     w
A     w     G
w     w     w
w     w     w
wwwwwwwwwwwww`],
    game : `
BasicGame
  SpriteSet         
    goal > Immovable color=GREEN
    wall > Immovable color=BLACK
    bullet > Missile speed=1 singleton=True color=RED
    avatar  > ShootAvatar stype=bullet

  LevelMapping
    w > wall       
    G > goal

  InteractionSet
    wall bullet > killSprite 
    bullet wall > killSprite    
    goal avatar > killSprite

    bullet EOS > killSprite

    avatar EOS > stepBack
    avatar wall > stepBack

  TerminationSet
    SpriteCounter stype=goal win=True`
},

    simpleGame : {
levels : [`
wwwwwwwwwwwwwwwwwwwwww
w        w    w      w
w           www      w
w             w     ww
w           G        w
w   w                w
w    www          w  w
w      wwwwwww  www  w
w              ww    w
w  G            w    w
w  ww  G           G w
wA    wwwwww         w
wwwwwwwwwwwwwwwwwwwwww
`],
game : `
BasicGame
   SpriteSet    
      pad > Immovable color=BLUE 
      avatar > MovingAvatar
            
   TerminationSet
      SpriteCounter stype=pad win=True      
           
   InteractionSet
      avatar EOS > stepBack
      avatar wall > stepBack
      pad avatar > killSprite

   LevelMapping
      G > pad`
    },

    simpleGame_big : {
levels : [`
wwwwwwwwwwwwwwwwwwwwwwwwwww
w                    1   ww
w     p1                1 w
w    p p               wgww
w    pAmp              w ww
w     ppp         1    w ww
w         1            w ww
w                      w ww
w                      w ww
w                      w ww
w                      w ww
w                      w ww
w                      w ww
w                      w ww
w                      w ww
w                      w ww
w                      w ww
wwwwwwwwwwwwwwwwwwwwwwwwwww`], 
game : `
BasicGame frame_rate=30
    SpriteSet        
        avatar > MovingAvatar color=DARKBLUE #cooldown=4 
        goal > Passive color=GOLD
        poison > Resource limit=3 color=BROWN
        box  > ResourcePack color=ORANGE
        wall > Immovable color=BLACK      
        score > Resource color=PINK limit=10 
        medicine > Resource limit=3 color=WHITE        
    LevelMapping
        p > poison
        1 > box
        w > wall   
        g > goal 
        h > hole
        m > medicine
    InteractionSet
        avatar wall > stepBack
        avatar medicine > changeResource resource=medicine value=1
        medicine avatar > killSprite  
        poison avatar > killSprite
        avatar poison > changeResource resource=medicine value=-1
        avatar poison > killIfHasLess resource=medicine limit=-1
        goal avatar > killSprite
        box avatar  > bounceForward
        goal box > bounceForward
        goal wall > undoAll
        box wall    > undoAll
        box box     > bounceForward
        box treasure > undoAll
        box poison > undoAll
    TerminationSet
        SpriteCounter stype=goal    limit=0 win=True
        SpriteCounter stype=avatar  limit=0 win=False`},

    simpleGame_boxes : {
levels : [`
wwwwwwwwwwwww
wA    w     w
w     w     w
w x x w     G
w     w     w
wb          w
wwwwwwwwwwwww`],
game : `
BasicGame
  SpriteSet         
    goal > Immovable color=GREEN
    wall > Immovable color=BLACK
    bullet > Missile speed=.6 orientation=RIGHT color=RED
    box1 > ResourcePack color=GREEN

    avatar > MovingAvatar color=DARKBLUE
  LevelMapping
    w > wall       
    G > goal
    b > bullet
    x > box1

  InteractionSet
    goal avatar > killSprite

    box1 avatar > bounceForward
    box1 wall > stepBack
    box1 box1 > stepBack
    avatar box1 > stepBack
    bullet wall > reverseDirection
    bullet box1 > reverseDirection
    avatar bullet > killSprite
    avatar EOS > stepBack
    avatar wall > stepBack

  TerminationSet
    SpriteCounter stype=goal win=True
    SpriteCounter stype=avatar win=False`},

    simpleGame_many_poisions : {
levels : [`
wwwwwwwwwwwwwwwwww
w  1    p        w
w    2    p      w
wA  q     2  w  ww
w    w1      w  ww
ww         q     w
w   p    q     1 w
w    2       g   w
w        2       w
wwwwwwwwwwwwwwwwww`,
`
wwwwwwwwwwwwwwwwww
w  1    w       2w
w    2  w        w
w         2     ww
w     1         ww
ww         q A   w
w        q     p w
w     wwwww      w
w  g          q  w
wwwwwwwwwwwwwwwwww`,
`
wwwwwwwwwwwwwwwwww
wp      w    A  2w
w  g 2  w        w
w         2     ww
w     1         ww
ww     w   q     w
w   q  w       p w
w    2 w         w
w        2    1  w
wwwwwwwwwwwwwwwwww`,
`
wwwwwwwwwwwwwwwwww
wp     Aw    g  2w
w    2  w        w
w          1    ww
w  1  1  1      ww
ww   www   q     w
w              p w
w                w
w    1   2    1  w
wwwwwwwwwwwwwwwwww`,
`
wwwwwwwwwwwwwwwwww
wp     Aw       2w
w    1 11        w
w  2    1   www ww
w  2  2  1      ww
ww   www   q w   w
w            w g w
w            w   w
w    1   2    1  w
wwwwwwwwwwwwwwwwww`,
`
wwwwwwwwwwwwwwwwww
wp      w       2w
w       1    11  w
w   g      1    ww
w  1  12 1      ww
ww         q     w
w              A w
w  ww     q      w
w    1   2    1  w
wwwwwwwwwwwwwwwwww`],

game : `
BasicGame frame_rate=30
    SpriteSet        
        avatar > MovingAvatar color=DARKBLUE #cooldown=4 
        goal > ResourcePack color=GOLD
        poison1 > ResourcePack color=BROWN
        poison2 > ResourcePack color=PINK
        box1 > ResourcePack color=GREEN
        box2 > ResourcePack color=LIGHTBLUE
        wall > Immovable color=BLACK      
        score > Resource color=PINK limit=10  
        missile > Missile color=RED speed=.2      
    LevelMapping
        p > poison1
        q > poison2
        1 > box1
        2 > box2
        w > wall   
        g > goal 
        m > missile
    InteractionSet
        avatar wall > stepBack  
        missile wall > reverseDirection
        poison1 avatar > killSprite
        poison2 avatar > killSprite
        avatar poison1 > killSprite
        avatar poison2 > killSprite
        goal avatar > killSprite
        box1 avatar > bounceForward
        box2 avatar  > killSprite
        goal box1 > bounceForward
        goal box2 > bounceForward
        goal wall > undoAll
        goal poison1 > undoAll
        goal poison2 > undoAll
        box1 wall    > undoAll    
        box2 wall    > undoAll    
        box1 poison1 > undoAll
        box2 poison1 > undoAll
        box1 poison2 > undoAll
        box2 poison2 > undoAll
    TerminationSet
        SpriteCounter stype=goal    limit=0 win=True
        SpriteCounter stype=avatar  limit=0 win=False` 
    },

    simpleGame_missile : {
levels : [
`
wwwwwwwwwwwww
w     w     w
w     w     w
A     w     G
w     w     w
w     w     w
wwwwwwwwwwwww`,
`
wwwwwwwwwwwww
wA    w     w
w  b  w     w
wwwpwww     G
w     w     w
w           w
wwwwwwwwwwwww`],
game : `
BasicGame
  SpriteSet         
    goal > Immovable color=GREEN
    wall > Immovable color=BLACK
    bullet > Missile speed=1 singleton=True color=RED
    avatar  > ShootAvatar stype=bullet

  LevelMapping
    w > wall       
    G > goal
    b > bullet

  InteractionSet
    wall bullet > killSprite 
    bullet wall > killSprite    
    goal avatar > killSprite

    bullet EOS > killSprite

    avatar EOS > stepBack
    avatar wall > stepBack

  TerminationSet
    SpriteCounter stype=goal win=True`
    },

    simpleGame_multiroom : {
levels : [`
wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww
w      w          w                 w
w      w       b  w         w       w
w   a  w          w    z    w  y    w
w      w                    w       w
w      w          w         w       w
w      w          w         w       w
w                 w         w       w
w      wwww wwwwwwwwwwwwwww wwwwwwwww
w wwwwww               w            w
w      w         2     w            w
w  A   w               w      y     w
w      w               w            w
w      w               w            g
wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww`],

game : `
BasicGame frame_rate=30
    SpriteSet
        avatar > MovingAvatar color=DARKBLUE #cooldown=4 
        box > Passive
            box1 > color=ORANGE
            box2 > color=ORANGE
        mover > VGDLSprite
            rand > RandomNPC cooldown=10
                rand1 > color=PURPLE
                rand2 > color=PURPLE
        wall > ResourcePack color=BLACK  
        missile > Missile
            missile1 > color=PINK speed=0.05 orientation=UP
            missile2 > color=PINK   speed=0.05 orientation=RIGHT
        goal > Immovable color=GOLD
    LevelMapping
        w > wall   
        a > box1
        b > box2
        x > chaser
        y > rand1
        z > rand2
        1 > missile1
        2 > missile2
        g > goal
    InteractionSet
        avatar wall > stepBack 
        mover wall > stepBack
        box avatar > killSprite  
        missile wall > reverseDirection
        avatar missile > killSprite
        missile missile > reverseDirection
        avatar mover > killSprite
        mover mover > stepBack
        mover missile > stepBack
        mover box > stepBack
        goal avatar > killSprite
    TerminationSet
        SpriteCounter stype=avatar  limit=0 win=False          
        SpriteCounter stype=goal limit=0 win=True`
    },

    simpleGame_preconditions : {
levels : [`
wwwwwwwwwwwww
w m         w
w           w
w     cpppppw
w A     p  gw
wwwwwwwwwwwww`],

game : `
BasicGame frame_rate=30
    SpriteSet        
        avatar > MovingAvatar color=DARKBLUE #cooldown=4              
        goal > Passive color=GOLD
        cloud > Passive 
            blue > color=BLUE
        medicine > Resource limit=10 color=WHITE
        poison > Resource limit=3 color=BROWN
        wall > Immovable color=BLACK      
    LevelMapping
        0 > hole
        c > blue 
        m > medicine
        p > poison
        w > wall   
        g > goal 
    InteractionSet
        avatar wall > stepBack  
        avatar medicine > changeResource resource=medicine value=2
        medicine avatar > killSprite
        avatar poison > changeResource resource=medicine value=-1
        avatar poison > killIfHasLess resource=medicine limit=-1
        poison avatar > killSprite
        cloud avatar  > bounceForward
        goal avatar > killSprite
    TerminationSet
        SpriteCounter stype=avatar  limit=0 win=False   
        SpriteCounter stype=goal limit=0 win=True    `
    },

    simpleGame_push_boulders : {
levels : [`
wwwwwwwwwwwwwwwwww
w    w  p        w
w  1 w    p      w
wA  q     2  w  ww
wwwwww1  g   w  ww
ww         q     w
w   p    q     1 w
w    2           w
w        2       w
wwwwwwwwwwwwwwwwww`],

game : `
BasicGame frame_rate=30
    SpriteSet        
        avatar > MovingAvatar color=DARKBLUE #cooldown=4 
        goal > ResourcePack color=GOLD
        poison >
            poison1 > ResourcePack color=BROWN
            poison2 > ResourcePack color=PINK
        box >
            box1 > ResourcePack color=GREEN
            box2 > ResourcePack color=LIGHTBLUE
        wall > Immovable color=BLACK      
        score > Resource color=PINK limit=10  
        missile > Missile color=RED speed=.2      
    LevelMapping
        p > poison1
        q > poison2
        1 > box1
        2 > box2
        w > wall   
        g > goal 
        m > missile
    InteractionSet
        avatar wall > stepBack
        missile wall > reverseDirection
        poison avatar > killSprite
        avatar poison > killSprite
        
        goal avatar > killSprite

        
        box box > bounceForward
        box wall > stepBack

        box avatar > bounceForward
        

        goal box > stepBack
        goal box > bounceForward

        goal poison > stepBack
        goal wall > stepBack

        poison box1 > killSprite
        box2 poison > killSprite
    TerminationSet
        SpriteCounter stype=goal    limit=0 win=True
        SpriteCounter stype=avatar  limit=0 win=False`
    },

    simpleGame_teleport : {
levels : [
`
wwwwwwwwwwwwwwwwww
wA w    p        w
w  w 2    ip     w
w      w  2  w  ww
w    w1      w  ww
wwwww q    q     w
w   p    q     1 w
w    2       o   w
w        2     g w
wwwwwwwwwwwwwwwwww`],

game : `
BasicGame frame_rate=30
    SpriteSet        
        
        goal > ResourcePack color=GOLD
        poison1 > ResourcePack color=BROWN
        poison2 > ResourcePack color=PINK
        box1 > ResourcePack color=GREEN
        box2 > ResourcePack color=LIGHTBLUE
        entry > Portal stype=exit1 color=GRAY 
        exit > Portal 
            exit1 > color=PURPLE
        wall > Immovable color=BLACK      
        score > Resource color=PINK limit=10  
        missile > Missile color=RED speed=.2    
        avatar > MovingAvatar color=DARKBLUE #cooldown=4   
    LevelMapping
        p > poison1
        q > poison2
        1 > box1
        2 > box2
        i > entry
        o > exit1
        w > wall   
        g > goal 
        m > missile
    InteractionSet
        avatar wall > stepBack  
        missile wall > reverseDirection
        poison1 avatar > killSprite
        poison2 avatar > killSprite
        avatar poison1 > killSprite
        avatar poison2 > killSprite
        avatar entry > teleportToExit
        goal avatar > killSprite
        box1 avatar > bounceForward
        box2 avatar  > killSprite
        goal box1 > bounceForward
        goal box2 > bounceForward
        goal wall > undoAll
        goal poison1 > undoAll
        goal poison2 > undoAll
        box1 wall    > undoAll    
        box2 wall    > undoAll    
        box1 poison1 > undoAll
        box2 poison1 > undoAll
        box1 poison2 > undoAll
        box2 poison2 > undoAll
    TerminationSet
        SpriteCounter stype=goal    limit=0 win=True
        SpriteCounter stype=avatar  limit=0 win=False`
    },

    spriteInduction : {
levels : [
`
wwwwwwwwwwwwwwwwwwwwwwww
ww          ww        ww
w                     ww
w         h    A       w
w                    www
w                      w
w                a c   w
w                      w
wwwwwwwwwwwwwwwwwwwwwwww`],

game : `
BasicGame
    SpriteSet
        carcass > Immovable color=BROWN
        goat > stype=avatar cooldown=3
            angry  > Chaser speed=0.5 color=ORANGE
        hay > Passive color=YELLOW


    InteractionSet
        goat    wall   > stepBack
        avatar  wall   > stepBack
        angry   wall   > stepBack
        avatar  angry  > killSprite
        carcass avatar > killSprite
        hay     avatar  > killSprite

    LevelMapping
        a > angry
        c > carcass
        h > hay

    TerminationSet
        SpriteCounter stype=hay win=True
        SpriteCounter stype=avatar win=False`
    },

    spriteInduction2 : {
levels : [
`
wwwwwwwwwwwwwwwwwwwwwwww
wwww        ww        ww
w                     ww
w         h    A       w
w                    www
www              a c   w
w                      w
wwwwwwwwwwwwwwwwwwwwwwww`],

game : `
BasicGame
    SpriteSet
        carcass > ResourcePack color=BROWN
        goat > stype=avatar cooldown=3
            angry  > RandomNPC speed=.2 color=ORANGE
        hay > Resource color=YELLOW


    InteractionSet
        goat    wall   > stepBack
        avatar  wall   > stepBack
        angry   wall   > stepBack
        avatar  angry  > killSprite
        carcass avatar > killSprite
        hay     avatar  > killSprite

    LevelMapping
        a > angry
        c > carcass
        h > hay

    TerminationSet
        SpriteCounter stype=hay win=True
        SpriteCounter stype=avatar win=False`
    },

    spriteInduction3 : {
levels : [
`
wwwwwwwwwwwwwwwwwwwwwwww
wwww        ww        ww
w                     ww
w         h    A       w
w wwww               www
w                     ww
ww                     w
ww                     w
www                    w
www              a c   w
w                      w
wwwwwwwwwwwwwwwwwwwwwwww`],

game : `
BasicGame
    SpriteSet
        carcass > Immovable color=BROWN
        goat > stype=avatar cooldown=3
            angry  > AStarChaser color=ORANGE stype=avatar cooldown=3 singleton=True
        hay > Passive color=YELLOW


    InteractionSet
        goat    wall   > stepBack
        avatar  wall   > stepBack
        angry   wall   > stepBack
        avatar  angry  > killSprite
        carcass avatar > killSprite
        hay     avatar  > killSprite

    LevelMapping
        a > angry
        c > carcass
        h > hay

    TerminationSet
        SpriteCounter stype=hay win=True
        SpriteCounter stype=avatar win=False`
    },

    spriteInduction4 : {
levels : [
`
wwwwwwwwwwwwwwwwwwwwwwww
wwww        ww        ww
w                     ww
w         h    A       w
w wwww               www
w                     ww
ww                     w
ww                     w
www                    w
www              a c   w
w                      w
wwwwwwwwwwwwwwwwwwwwwwww`],

game : `
BasicGame
    SpriteSet
        carcass > Immovable color=BROWN
        angry  > Missile color=ORANGE speed=0.5
        hay > Passive color=YELLOW


    InteractionSet
        avatar  wall   > stepBack
        angry   wall   > stepBack
        avatar  angry  > killSprite
        carcass avatar > killSprite
        hay     avatar  > killSprite

    LevelMapping
        a > angry
        c > carcass
        h > hay

    TerminationSet
        SpriteCounter stype=hay win=True
        SpriteCounter stype=avatar win=False`
    },

    test_images : {
levels : [`
wwwwwwwwwwwwww
w            w
w            w
w   A        w
w            w
w            w
w            w
w            w
w            w
wwwwwwwwwwwwww`],

game : `
BasicGame
    SpriteSet
        avatar > MovingAvatar image=Apple.jpg


    InteractionSet
        avatar  wall   > stepBack

    LevelMapping

    TerminationSet
        SpriteCounter stype=avatar win=False`
    }

}

var experiments = {
    exp1 : [
        ['dodge', [0], 3, true], 
        ['simpleGame1', [0], 1, true]
    ], 

    exp2 : [
        ['aliens', [0], 2, false],
        ['simpleGame4', [0, 2, 3], 2, true]
    ]
}

    that.get_games_list = function () {
        return Object.keys(games);
    }

    // Returns the game rules and the level mapping of level number (if given);
    // if game name does not exist, game and map are undefined TODO - make exception
    that.get_game = function (name, level) {
        if (!(level)) level = 0;

        var return_game = {};
        return_game.game = games[name].game;
        return_game.level = games[name].levels[level];
        return_game.name = name;
        return_game.round = 0;
        return return_game;
    }

    that.new_experiment = function (exp_name) {
        var Experiment = function () {
            var experiment = Object.create(Experiment.prototype);

            var games_ordered = [];
            var game_number = 0;
            experiments[exp_name].forEach(settings => {
                game_number ++;
                var next_games = [];
                var game_name = settings[0];
                var game_levels = settings[1];
                var level_rounds = settings[2];
                if (settings[3])
                    game_levels = shuffle(game_levels);

                game_levels.forEach(game_level => {
                    for (var i = 0; i < level_rounds ; i++) {
                        next_games.push([game_name, game_level, game_number, i+1])
                    }
                })
                games_ordered = games_ordered.concat(next_games);
            })


            var current_trial = 0;
            var max_trials = games_ordered.length

            experiment.current_game_obj = function () {
                if (current_trial == max_trials)
                    return false;
                var current_game = games_ordered[current_trial]
                var game_obj = that.get_game(current_game[0], current_game[1]);
                game_obj.name = current_game[2];
                game_obj.round = current_game[3];
                return game_obj;
            }

            experiment.next = function () {
                current_trial += 1;
            }

            Object.freeze(experiment);
            return experiment;
        }

        return Experiment();
    }

    // Allows user to add a game to be able to play
    // all are string fields
    that.add_game = function (name, game, level) {
        games[game].game = game;
        games[game].levels = [level];
    }

    Object.freeze(that);
    return that;
}


module.exports = Games;
/**
show agent killing a moving item.
same prediction should be highest for other moving items of same speed, then for non-moving items.
also vice-versa.
**/
   