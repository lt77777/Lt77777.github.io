class FileTreeNode {
    // types: "folder", "game", "file"
    constructor(directoryName, type = "folder") {
        this.name = directoryName;
        this.descendants = [];
        this.type = type;
        this.parent = null;
    }

    addChild(newChild) {
        let good = true;
        this.descendants.forEach(function (child) {
            if (child.name === newChild.name) {
                good = false;
                console.warn("Child node has same name as sibling, addChild failed.");
            }
        });
        if (good) {
            this.descendants.push(newChild);
            newChild.parent = this;
        }
    }

    addChildName(newChildName, type = "folder") {
        let child = new FileTreeNode(newChildName, type);
        this.addChild(child, type);
    }

    // we don't really need a remove child, unless we want the user to be able to change the file system.
}

export default class FileTreeSystem {
    constructor(rootName) {
        this.root = new FileTreeNode(rootName);
        this.currentNode = this.root;
    }

    // given a child directory name navigate to it e.g. "../blog"
    // returns: 0 - successful, 1 - failed to navigate, 2 - not a folder/directory
    navigateTo(string) {
        let current = this.currentNode;
        string = string.split("/");
        for (let name of string) {
            if (name === "..") {
                // go up a directory
                if (current.parent !== null) {
                    current = current.parent;
                } else {
                    // failed to locate parent (we are at root)
                    return 1;
                }
            } else if (name === ".") {
                // pass
            } else {
                // go to a child
                let children = current.descendants;
                let foundChild = false;
                for (let child of children) {
                    if (child.name === name) {
                        if (child.type === "folder") {
                            current = child;
                            foundChild = true;
                            break;
                        } else {
                            return 2;
                        }
                    }
                }
                if (!foundChild) {
                    return 1;
                }
            }
        }
        this.currentNode = current;
        return 0;
    }

    // returns the children of the current node
    getChildren() {
        return this.currentNode.descendants;
    }

    getChildByName(childName) {
        for (let child of this.currentNode.descendants) {
            if (child.name === childName) return child;
        }
        return null;
    }

    getChildrenOfType(typeName) {
        let list = [];
        for (let child of this.currentNode.descendants) {
            if (child.type === typeName) list.push(child);
        }
        return list;
    }

    getChildNames() {
        return this.currentNode.descendants.map(child => child.name);
    }

    addChild(childName, type = "folder") {
        this.currentNode.addChildName(childName, type);
    }

    getCurrentDirectoryName() {
        return this.currentNode.name;
    }

    getFullPathName() {
        let current = this.currentNode;
        let fileString = this.currentNode.name;
        while (current.parent !== null) {
            current = current.parent;
            fileString = current.name + "/" + fileString;
        }
        return fileString;
    }
}