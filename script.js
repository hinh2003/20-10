/* =================== TRÁI TIM 2D =================== */
var settings = { particles: { length: 8000, duration: 4, velocity: 80, effect: -1.3, size: 8 } };
(function(){var b=0,c=["ms","moz","webkit","o"];for(var a=0;a<c.length&&!window.requestAnimationFrame;++a){
  window.requestAnimationFrame=window[c[a]+"RequestAnimationFrame"];
  window.cancelAnimationFrame=window[c[a]+"CancelAnimationFrame"]||window[c[a]+"CancelRequestAnimationFrame"]}
  if(!window.requestAnimationFrame){window.requestAnimationFrame=function(h){var d=Date.now();var f=Math.max(0,16-(d-b));
  var g=setTimeout(function(){h(d+f)},f);b=d+f;return g}};if(!window.cancelAnimationFrame){window.cancelAnimationFrame=function(d){clearTimeout(d)}}})();

function Point(x,y){this.x=x||0;this.y=y||0;}
Point.prototype.clone=function(){return new Point(this.x,this.y);}
Point.prototype.length=function(len){if(len===undefined)return Math.hypot(this.x,this.y);this.normalize();this.x*=len;this.y*=len;return this;}
Point.prototype.normalize=function(){var l=this.length();this.x/=l;this.y/=l;return this;}

function Particle(){this.position=new Point();this.velocity=new Point();this.acceleration=new Point();this.age=0;}
Particle.prototype.initialize=function(x,y,dx,dy){
  this.position.x=x;this.position.y=y;this.velocity.x=dx;this.velocity.y=dy;
  this.acceleration.x=dx*settings.particles.effect;this.acceleration.y=dy*settings.particles.effect;this.age=0;
};
Particle.prototype.update=function(dt){this.position.x+=this.velocity.x*dt;this.position.y+=this.velocity.y*dt;
  this.velocity.x+=this.acceleration.x*dt;this.velocity.y+=this.acceleration.y*dt;this.age+=dt;};
Particle.prototype.draw=function(ctx,img){function ease(t){return (--t)*t*t+1;}
  var size=img.width*ease(this.age/settings.particles.duration);
  ctx.globalAlpha=1-this.age/settings.particles.duration;
  ctx.drawImage(img,this.position.x-size/2,this.position.y-size/2,size,size);
};

function ParticlePool(length){var ps=new Array(length);for(var i=0;i<length;i++)ps[i]=new Particle();
  var firstActive=0,firstFree=0,dur=settings.particles.duration;
  this.add=function(x,y,dx,dy){ps[firstFree].initialize(x,y,dx,dy);firstFree++;if(firstFree==length)firstFree=0;
    if(firstActive==firstFree)firstActive++;if(firstActive==length)firstActive=0;};
  this.update=function(dt){var i;if(firstActive<firstFree){for(i=firstActive;i<firstFree;i++)ps[i].update(dt);}
    else {for(i=firstActive;i<length;i++)ps[i].update(dt);for(i=0;i<firstFree;i++)ps[i].update(dt);}
    while(ps[firstActive].age>=dur && firstActive!=firstFree){firstActive++;if(firstActive==length)firstActive=0;}};
  this.draw=function(ctx,img){var i;if(firstActive<firstFree){for(i=firstActive;i<firstFree;i++)ps[i].draw(ctx,img);}
    else {for(i=firstActive;i<length;i++)ps[i].draw(ctx,img);for(i=0;i<firstFree;i++)ps[i].draw(ctx,img);}};
}

(function(canvas){
  var ctx=canvas.getContext('2d'), pool=new ParticlePool(settings.particles.length),
      rate=settings.particles.length/settings.particles.duration, time;

  function pointOnHeart(t){ return new Point(
    160*Math.pow(Math.sin(t),3),
    130*Math.cos(t)-50*Math.cos(2*t)-20*Math.cos(3*t)-10*Math.cos(4*t)+25
  );}

  var image=(function(){
    var c=document.createElement('canvas'),g=c.getContext('2d');
    c.width=settings.particles.size; c.height=settings.particles.size;
    function to(t){var p=pointOnHeart(t);
      p.x=settings.particles.size/2+p.x*settings.particles.size/350;
      p.y=settings.particles.size/2-p.y*settings.particles.size/350; return p;}
    g.beginPath(); var t=-Math.PI,p=to(t); g.moveTo(p.x,p.y);
    while(t<Math.PI){t+=0.01;p=to(t);g.lineTo(p.x,p.y);} g.closePath();
    g.fillStyle='#db0acaff'; g.fill();
    var img=new Image(); img.src=c.toDataURL(); return img;
  })();

  function render(){
    requestAnimationFrame(render);
    var newTime=Date.now()/1000,dt=newTime-(time||newTime); time=newTime;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    var amount=rate*dt;
    for(var i=0;i<amount;i++){
      var pos=pointOnHeart(Math.PI-2*Math.PI*Math.random());
      var dir=pos.clone().length(settings.particles.velocity);
      pool.add(canvas.width/2+pos.x,canvas.height/2-pos.y,dir.x,-dir.y);
    }
    pool.update(dt); pool.draw(ctx,image);
  }

  function resize(){ canvas.width=innerWidth; canvas.height=innerHeight; }
  addEventListener('resize', resize);
  setTimeout(function(){ resize(); render(); }, 10);
})(document.getElementById('pinkboard'));

(function createGalaxyText() {
  const container = document.getElementById('galaxy-text');
  
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, container.offsetWidth / container.offsetHeight, 0.1, 1000);
  camera.position.set(0, 8, 12);
  camera.lookAt(0, 0, 0);
  
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.offsetWidth, container.offsetHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);
  
  function createTextSprite(text, fontSize = 32, color = '#ff66cc') {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    ctx.font = `bold ${fontSize}px Poppins, sans-serif`;
    const metrics = ctx.measureText(text);
    const textWidth = metrics.width;
    
    canvas.width = textWidth + 40;
    canvas.height = fontSize + 30;
    
    ctx.font = `bold ${fontSize}px Poppins, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, '#ff9ad1');
    gradient.addColorStop(0.5, color);
    gradient.addColorStop(1, '#ffd1e9');
    
    ctx.shadowColor = color;
    ctx.shadowBlur = 20;
    ctx.fillStyle = gradient;
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    
    const material = new THREE.SpriteMaterial({ 
      map: texture,
      transparent: true,
      opacity: 0.9
    });
    
    const sprite = new THREE.Sprite(material);
    const scale = 2.5;
    sprite.scale.set(canvas.width / 100 * scale, canvas.height / 100 * scale, 1);
    
    return sprite;
  }
  
  let currentConfig = [
    { texts: ['🌸', 'Chúc chị em ', '20/10', '🌸'], radius: 6, speed: 0.3, direction: 1 },
    { texts: ['💕', 'vui vẻ', 'mạnh khỏe', '💕'], radius: 8, speed: 0.25, direction: -1 },
    { texts: ['✨', 'luôn ngập tràn', 'hạnh phúc', '✨'], radius: 10, speed: 0.2, direction: 1 }
  ];
  
  let rings = [];
  
  function createRings(config) {
    rings.forEach(ring => {
      ring.sprites.forEach(sprite => {
        scene.remove(sprite);
        if (sprite.material.map) sprite.material.map.dispose();
        sprite.material.dispose();
      });
    });
    rings = [];
    
    config.forEach((group, groupIndex) => {
      const ring = {
        sprites: [],
        radius: group.radius,
        speed: group.speed,
        direction: group.direction,
        offset: (groupIndex * Math.PI) / config.length
      };
      
      group.texts.forEach((text, i) => {
        if (!text.trim()) return;
        
        const sprite = createTextSprite(text, 28, '#ff66cc');
        const angle = (i / group.texts.length) * Math.PI * 2 + ring.offset;
        
        sprite.position.x = Math.cos(angle) * group.radius;
        sprite.position.z = Math.sin(angle) * group.radius;
        sprite.position.y = 0;
        
        sprite.userData = { 
          angle: angle,
          originalY: 0,
          floatOffset: Math.random() * Math.PI * 2
        };
        
        scene.add(sprite);
        ring.sprites.push(sprite);
      });
      
      rings.push(ring);
    });
  }
  
  createRings(currentConfig);
  
  window.updateGalaxyText = function(newConfig) {
    currentConfig = newConfig;
    createRings(newConfig);
  };
  
  let time = 0;
  function animate() {
    requestAnimationFrame(animate);
    time += 0.016;
    
    rings.forEach(ring => {
      ring.sprites.forEach((sprite, i) => {
        sprite.userData.angle += ring.speed * 0.01 * ring.direction;
        sprite.position.x = Math.cos(sprite.userData.angle) * ring.radius;
        sprite.position.z = Math.sin(sprite.userData.angle) * ring.radius;
        sprite.position.y = sprite.userData.originalY + Math.sin(time * 2 + sprite.userData.floatOffset) * 0.3;
        sprite.material.opacity = 0.85 + Math.sin(time * 3 + i) * 0.15;
      });
    });
    
    camera.position.x = Math.sin(time * 0.1) * 2;
    camera.lookAt(0, 0, 0);
    
    renderer.render(scene, camera);
  }
  
  animate();
  
  function onResize() {
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  
  window.addEventListener('resize', onResize);
})();

/* =================== ĐIỀU KHIỂN PANEL =================== */
function showPanel() {
  document.getElementById('text-input-panel').classList.remove('hidden');
}

function hidePanel() {
  document.getElementById('text-input-panel').classList.add('hidden');
}

function applyText() {
  const newConfig = [
    {
      texts: [
        document.getElementById('ring1-1').value,
        document.getElementById('ring1-2').value,
        document.getElementById('ring1-3').value,
        document.getElementById('ring1-4').value
      ],
      radius: 6,
      speed: 0.3,
      direction: 1
    },
    {
      texts: [
        document.getElementById('ring2-1').value,
        document.getElementById('ring2-2').value,
        document.getElementById('ring2-3').value,
        document.getElementById('ring2-4').value
      ],
      radius: 8,
      speed: 0.25,
      direction: -1
    },
    {
      texts: [
        document.getElementById('ring3-1').value,
        document.getElementById('ring3-2').value,
        document.getElementById('ring3-3').value,
        document.getElementById('ring3-4').value
      ],
      radius: 10,
      speed: 0.2,
      direction: 1
    }
  ];
  
  window.updateGalaxyText(newConfig);
  hidePanel();
}
