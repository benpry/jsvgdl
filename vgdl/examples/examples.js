/**
Simple interactions: get/lose points, can't pass through walls, object gets pushed.
**/
var examples = {
    aliens : {
level : `
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
`,
game : `
BasicGame
    SpriteSet
        base    > Immovable    color=WHITE
        avatar  > FlakAvatar stype=sam
        missile > Missile
            sam  > orientation=UP    color=BLUE singleton=True
            bomb > orientation=DOWN  color=RED  speed=0.5
        alien   > Bomber       stype=bomb   prob=0  cooldown=3 speed=0.75
        portal  > SpawnPoint   stype=alien  cooldown=1   total=3
    
    LevelMapping
        0 > base
        1 > portal

    TerminationSet
        SpriteCounter      stype=avatar               limit=0 win=False
        MultiSpriteCounter stype1=portal stype2=alien limit=0 win=True
        
    InteractionSet
        avatar  EOS  > stepBack
        alien   EOS  > turnAround        
        missile EOS  > killSprite
        missile base > killSprite
        base missile > killSprite
        base   alien > killSprite
        avatar alien > killSprite
        avatar bomb  > killSprite
        alien  sam   > killSprite     
`
    },
    predictions1 : {
level :`
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
`,
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
    simpleGame : {
level : `
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
`,
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
    }
}
/**
show agent killing a moving item.
same prediction should be highest for other moving items of same speed, then for non-moving items.
also vice-versa.
**/
   