import Canvas  from "./Canvas/Canvas";
import astrological_bodies from './data/plantery_starting.json';

const G = 6.67430e-11; // Gravitational constant in m^3 kg^-1 s^-2
const dt = 0.1;
const mainBodies = new Map();

astrological_bodies.forEach(body => {
  let mainBodiesObj = {
    coordinates: body.coordinates,
    mass: body.mass,
    velocity: body.velocity,
    colour: body.colour,
    image: body.image,
    radius: body.radius
  };
  mainBodies.set(body.name, mainBodiesObj)
});

function grav(body1_name, body2_name) {
 
  let body1 = mainBodies.get(body1_name);
  let body1_x = body1.coordinates.x;
  let body1_y = body1.coordinates.y;
  let body1_mass = body1.mass;
  let body1_vx = body1.velocity.vx;;
  let body1_vy =body1.velocity.vy;;

  let body2 = mainBodies.get(body2_name);
  let body2_x = body2.coordinates.x;
  let body2_y = body2.coordinates.y;
  let body2_mass = body2.mass;
  let body2_vx = body2.velocity.vx;
  let body2_vy = body2.velocity.vy;

  // distance between
  let dx = body1_x - body2_x;
  let dy = body1_y - body2_y;
  let r = Math.sqrt(dx **2 + dy ** 2);
  //console.log(`Distance: ${r} km`);
  // force
  let f = G*((body1_mass*body2_mass)/r**2)
  //console.log(`Gravitational Force: ${f} N`);
  //x-y componets
  let unitDx = dx / r;
  let unitDy = dy / r;
  let fx_b1 = -1*f * unitDx;
  let fy_b1 = -1*f * unitDy;
  let fx_b2 = f * unitDx;
  let fy_b2 = f * unitDy;
  // Compute acceleration:
  let ax_b1 = fx_b1/body1_mass;
  let ay_b1 = fy_b1/body1_mass;
  let ax_b2 = fx_b2/body2_mass;
  let ay_b2 = fy_b2/body2_mass;
  // Update velocity:
  body1.velocity.vx = body1_vx + ax_b1*dt;
  body1.velocity.vy = body1_vy + ay_b1*dt;
  body2.velocity.vx = body2_vx + ax_b2*dt;
  body2.velocity.vy = body2_vy + ay_b2*dt;
  // Update position
  body1.coordinates.x = body1_x + body1_vx*dt;
  body1.coordinates.y = body1_y + body1_vy*dt;
  body2.coordinates.x = body2_x + body2_vx*dt;
  body2.coordinates.y = body2_y + body2_vy*dt;
}

function drawVectors(context, planet) {
  const x = planet.coordinates.x;
  const y =  planet.coordinates.y;
  context.beginPath(); // Start a new path
  context.moveTo(x,y); // Move the "pen" to the starting point
  context.lineTo(x + 10*planet.velocity.vx, y + 10*planet.velocity.vy); // Draw a line to the ending point
  context.strokeStyle = "red"; // Set the line color
  context.lineWidth = 1; // Set the line width
  context.stroke(); // Render the line
  context.closePath(); // End the path
  // Add text next to the line
  const label = `vx: ${Math.round((planet.velocity.vx + Number.EPSILON) * 1000) / 1000},
   vy: ${-Math.round((planet.velocity.vy + Number.EPSILON) * 1000) / 1000}`; // Text to display
  context.font = "11px Verdana"; // Font size and style
  context.fillStyle = "black"; // Text color
  context.fillText(label,x + 10*planet.velocity.vx, y + 10*planet.velocity.vy); // Place text near the line endpoint
}

function drawInfo(context, name, planet) {
  const x = planet.coordinates.x;
  const y =  planet.coordinates.y;
   const label = `${name}`; // Text to display
  context.font = "11px Verdana"; // Font size and style
  context.fillStyle = "black"; // Text color
  context.fillText(label, x-10, y+10); // Place text near the line endpoint
}

function drawVerboseInfo(context, planet) {

}

function App() {


    const radius = 10;

    const draw = (context, count) => {
        context.clearRect(0,0,context.canvas.width,context.canvas.height)

        // Compare every element with every other element exactly once
        const entries = Array.from(mainBodies.entries());

        for (let i = 0; i < entries.length; i++) {
            for (let j = i + 1; j < entries.length; j++) {
                const [key1, value1] = entries[i];
                const [key2, value2] = entries[j];
                grav(key1, key2);
            }
        }
        for (let i = 0; i < entries.length; i++) {
          const [name, planet] = entries[i];
          context.beginPath();
          context.arc(planet.coordinates.x, planet.coordinates.y, planet.radius, 0, Math.PI * 2);                    
          context.fillStyle = planet.colour;
          context.fill();
          context.closePath();
          drawVectors(context, planet);
          drawInfo(context, name, planet);
          drawVerboseInfo(context, planet);
        //   const img = new Image();
        //   img.src = `images/${planet.image}`;
        //   img.onload = () => {
        //     console.log("success load");
        //     // Draw the image on the canvas
        //     context.drawImage(
        //         img,
        //         planet.coordinates.x - radius, // Center the image based on its radius
        //         planet.coordinates.y - radius,
        //         radius * 2, // Width of the image
        //         radius * 2  // Height of the image
        //     );
        //   };
        //   img.onerror = () => {
        //     console.log(`fail load ${img.src}`);
        //     context.beginPath();
        //     context.arc(planet.coordinates.x, planet.coordinates.y, radius, 0, Math.PI * 2);                    
        //     context.fillStyle = planet.colour;
        //     context.fill();
        //     context.closePath();  
        //   }
        }
    }
  return <Canvas draw={draw} width= {window.innerWidth*10} height = {window.innerHeight*10}/>    
}

export default App;
