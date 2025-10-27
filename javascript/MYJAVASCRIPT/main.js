'use strict';

{
  const scores = {
    math: 80, 
    english: 90, 
  };
  let sum = 0;

  scores.physics = 70;

  const entries = Object.entries(scores);
  // console.log(entries);
  entries.forEach((prop) => {
    // console.log(prop);
    sum += prop[1];
    console.log(`${prop[0]}: ${prop[1]}`);
  });
  console.log(`Sum: ${sum}`);
  console.log(`Avarage: ${sum / entries.length}`);
}

