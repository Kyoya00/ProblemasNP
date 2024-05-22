let delay = 500;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function findSubsets(nums, subset = [], index = 0) {
  if (index === nums.length) {
    if (subset.length > 0 && subset.reduce((a, b) => a + b, 0) === 0) {
      updateSteps(subset);
      return true;
    }
    return false;
  }

  // Include nums[index]
  subset.push(nums[index]);
  updateSteps(subset);
  await sleep(delay);
  if (await findSubsets(nums, subset, index + 1)) {
    return true;
  }
  
  // Exclude nums[index]
  subset.pop();
  updateSteps(subset);
  await sleep(delay);
  if (await findSubsets(nums, subset, index + 1)) {
    return true;
  }

  return false;
}

function updateSteps(subset) {
  const stepsElement = document.getElementById('steps');
  const step = document.createElement('p');
  step.textContent = `Subconjunto atual: [${subset.join(', ')}]`;
  stepsElement.appendChild(step);
  stepsElement.scrollTop = stepsElement.scrollHeight;
}

function startSolving() {
  delay = parseInt(document.getElementById('delay').value);
  const input = document.getElementById('numbers').value;
  const nums = input.split(',').map(Number);
  document.getElementById('steps').innerHTML = '';
  findSubsets(nums).then(result => {
    if (result) {
      alert('Subconjunto encontrado!');
    } else {
      alert('Nenhum subconjunto encontrado.');
    }
  });
}
