function mergeSort(array) {
  if (array.length === 1) {
    return array;
  }

  const half = Math.ceil(array.length / 2);

  const leftHalf = mergeSort(array.slice(0, half));
  const rightHalf = mergeSort(array.slice(half));

  let total = [];

  while (
    typeof leftHalf[0] !== "undefined" &&
    typeof rightHalf[0] !== "undefined"
  ) {
    if (leftHalf[0] < rightHalf[0]) {
      total.push(leftHalf.shift());
    } else {
      total.push(rightHalf.shift());
    }
  }

  total = leftHalf[0] ? total.concat(leftHalf) : total.concat(rightHalf);

  return total;
}

function Node(nodeValue) {
  const value = nodeValue;
  let leftChild = null;
  let rightChild = null;

  return {
    value,
    leftChild,
    rightChild,
  };
}

function Tree(array) {
  const sortedArray = mergeSort([...new Set(array)]);

  const buildTree = (paramArray) => {
    const arrayLength = paramArray.length;

    if (arrayLength === 0) return null;

    let tempRoot;
    if (arrayLength === 1) {
      tempRoot = Node(paramArray[0]);
      tempRoot.leftChild = null;
      tempRoot.rightChild = null;
    } else {
      const half = Math.ceil((paramArray.length - 1) / 2);

      tempRoot = Node(paramArray[half]);
      tempRoot.leftChild = buildTree(paramArray.slice(0, half));
      tempRoot.rightChild = buildTree(paramArray.slice(half + 1));
    }

    return tempRoot;
  };

  let root = buildTree(sortedArray);

  const insert = (value, tempRoot = root) => {
    const nodeValue = tempRoot.value;
    if (value > nodeValue) {
      if (!tempRoot.rightChild) tempRoot.rightChild = Node(value);
      else insert(value, tempRoot.rightChild);
    } else if (value < nodeValue) {
      if (!tempRoot.leftChild) tempRoot.leftChild = Node(value);
      else insert(value, tempRoot.leftChild);
    }
  };

  const findMinNode = (tempRoot = root) => {
    if (!tempRoot.leftChild) return tempRoot;
    return findMinNode(tempRoot.leftChild);
  };

  function remove(value, tempRoot = root, parentRoot = null) {
    const nodeValue = tempRoot.value;
    if (value > nodeValue) {
      if (!tempRoot.rightChild) return;
      remove(value, tempRoot.rightChild, tempRoot);
    } else if (value < nodeValue) {
      if (!tempRoot.leftChild) return;
      remove(value, tempRoot.leftChild, tempRoot);
    } else {
      let newNode;
      if (!tempRoot.leftChild && !tempRoot.rightChild) {
        newNode = null;
      } else if (!tempRoot.leftChild || !tempRoot.rightChild) {
        newNode = !tempRoot.leftChild
          ? tempRoot.rightChild
          : tempRoot.leftChild;
      } else {
        newNode = findMinNode(tempRoot.rightChild);
        remove(newNode.value, tempRoot);
        newNode.leftChild = tempRoot.leftChild;
        newNode.rightChild = tempRoot.rightChild;
      }
      if (!parentRoot) {
        this.root = newNode;
        return;
      }
      if (tempRoot.value > parentRoot.value) parentRoot.rightChild = newNode;
      else parentRoot.leftChild = newNode;
    }
  }

  const find = (value, tempRoot = root) => {
    if (!tempRoot) return null;
    if (tempRoot.value === value) return tempRoot;
    return find(
      value,
      tempRoot.value < value ? tempRoot.rightChild : tempRoot.leftChild
    );
  };

  function levelOrder(callback) {
    const totalNodes = [];
    const queue = [root];

    while (queue[0]) {
      const current = queue.shift();
      totalNodes.push(current);

      if (callback) {
        callback(current);
      }

      if (current.leftChild) queue.push(current.leftChild);
      if (current.rightChild) queue.push(current.rightChild);
    }

    return callback ? undefined : totalNodes;
  }

  const preorder = (callback, tempRoot = root) => {
    if (!tempRoot) return [];
    let total = [];

    if (callback) {
      callback(tempRoot);
      preorder(callback, tempRoot.leftChild);
      preorder(callback, tempRoot.rightChild);
    } else {
      total = total.concat([tempRoot]);
      total = total.concat(preorder(callback, tempRoot.leftChild));
      total = total.concat(preorder(callback, tempRoot.rightChild));
    }

    return callback ? undefined : total;
  };

  const inorder = (callback, tempRoot = root) => {
    if (!tempRoot) return [];
    let total = [];

    if (callback) {
      inorder(callback, tempRoot.leftChild);
      callback(tempRoot);
      inorder(callback, tempRoot.rightChild);
    } else {
      total = total.concat(inorder(callback, tempRoot.leftChild));
      total = total.concat([tempRoot]);
      total = total.concat(inorder(callback, tempRoot.rightChild));
    }

    return callback ? undefined : total;
  };

  const postorder = (callback, tempRoot = root) => {
    if (!tempRoot) return [];
    let total = [];

    if (callback) {
      postorder(callback, tempRoot.leftChild);
      postorder(callback, tempRoot.rightChild);
      callback(tempRoot);
    } else {
      total = total.concat(postorder(callback, tempRoot.leftChild));
      total = total.concat(postorder(callback, tempRoot.rightChild));
      total = total.concat([tempRoot]);
    }

    return callback ? undefined : total;
  };

  const height = (node, prevHeight = -1) => {
    if (!node) return [0];
    let currentHeight = prevHeight + 1;
    let heights = [];
    if (!node?.leftChild && !node?.rightChild) return currentHeight;

    heights = heights.concat(height(node.leftChild, currentHeight));
    heights = heights.concat(height(node.rightChild, currentHeight));

    return Math.max(...heights);
  };

  function heigthHelper(node, prevHeight = -1) {
    if (!node) return [0];
    let currentHeight = prevHeight + 1;
    let heights = [];
    if (!node?.leftChild && !node?.rightChild) return [currentHeight];

    heights = heights.concat(height(node.leftChild, currentHeight));
    heights = heights.concat(height(node.rightChild, currentHeight));

    return heights;
  }

  const depth = (node, tempRoot = root) => {
    let depthValue = 1;

    if (!tempRoot) return null;
    if (tempRoot.value === node.value) return 0;
    depthValue += depth(
      node,
      tempRoot.value < node.value ? tempRoot.rightChild : tempRoot.leftChild
    );

    return depthValue;
  };

  function isBalanced() {
    const queue = [this.root];

    while (queue[0]) {
      const current = queue.shift();
      const leftHeights = heigthHelper(current.leftChild);
      const rightHeights = heigthHelper(current.rightChild);
      const leftMin = Math.min(...leftHeights);
      const leftMax = Math.max(...leftHeights);
      const rightMin = Math.min(...rightHeights);
      const rightMax = Math.max(...rightHeights);
      const diff1 = Math.abs(leftMin - rightMax);
      const diff2 = Math.abs(leftMax - rightMin);
      if (diff1 > 1 || diff2 > 1) return false;

      if (current.leftChild) queue.push(current.leftChild);
      if (current.rightChild) queue.push(current.rightChild);
    }

    return true;
  }

  function rebalance() {
    if (this.isBalanced()) return;

    const valuesArray = [];
    inorder((elem) => valuesArray.push(elem.value));
    this.root = buildTree(valuesArray);
  }

  function prettyPrint(node = this.root, prefix = "", isLeft = true) {
    if (node === null) {
      return;
    }
    if (node.rightChild !== null) {
      prettyPrint(
        node.rightChild,
        `${prefix}${isLeft ? "│   " : "    "}`,
        false
      );
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.value}`);
    if (node.leftChild !== null) {
      prettyPrint(node.leftChild, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
  }

  return {
    root,
    sortedArray,
    buildTree,
    prettyPrint,
    insert,
    remove,
    find,
    levelOrder,
    preorder,
    inorder,
    postorder,
    height,
    depth,
    isBalanced,
    rebalance,
    heigthHelper,
  };
}

function randomArray(size, lowerBound, upperBound) {
  const arr = [];

  for (let i = 0; i < size; i += 1) {
    arr.push(
      Math.floor(Math.random() * (upperBound - lowerBound) + lowerBound)
    );
  }

  return arr;
}

function driverScript() {
  const TreeInstance = Tree(randomArray(10, 0, 50));
  TreeInstance.prettyPrint();

  console.log("Tree is balanced: ", TreeInstance.isBalanced());

  const levelOrderValuesArray = [];
  TreeInstance.levelOrder((elem) => levelOrderValuesArray.push(elem.value));
  console.log("LevelOrder: ", levelOrderValuesArray);

  const preorderValuesArray = [];
  TreeInstance.preorder((elem) => preorderValuesArray.push(elem.value));
  console.log("Preorder: ", preorderValuesArray);

  const inorderValuesArray = [];
  TreeInstance.inorder((elem) => inorderValuesArray.push(elem.value));
  console.log("Inorder: ", inorderValuesArray);

  const postorderValuesArray = [];
  TreeInstance.postorder((elem) => postorderValuesArray.push(elem.value));
  console.log("Posorder: ", postorderValuesArray);

  for (let i = 0; i < 10; i += 1) {
    const newValue = Math.floor(Math.random() * (10000 - 500) + 500);
    console.log("Inserting", newValue);
    TreeInstance.insert(newValue);
  }

  TreeInstance.prettyPrint();

  console.log("Tree is balanced: ", TreeInstance.isBalanced());

  console.log("Balancing the tree");
  TreeInstance.rebalance();

  TreeInstance.prettyPrint();

  console.log("Tree is balanced: ", TreeInstance.isBalanced());

  const newLevelOrderValuesArray = [];
  TreeInstance.levelOrder((elem) => newLevelOrderValuesArray.push(elem.value));
  console.log("LevelOrder: ", newLevelOrderValuesArray);

  const newPreorderValuesArray = [];
  TreeInstance.preorder((elem) => newPreorderValuesArray.push(elem.value));
  console.log("Preorder: ", newPreorderValuesArray);

  const newInorderValuesArray = [];
  TreeInstance.inorder((elem) => newInorderValuesArray.push(elem.value));
  console.log("Inorder: ", newInorderValuesArray);

  const newPostorderValuesArray = [];
  TreeInstance.postorder((elem) => newPostorderValuesArray.push(elem.value));
  console.log("Posorder: ", newPostorderValuesArray);
}

driverScript();
