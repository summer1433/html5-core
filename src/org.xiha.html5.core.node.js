request('org.xiha.html5.util');

org.xiha.html5.core.Node = function(obj) {
	this.obj = obj;
	this.parents = null;
	this.childs = null;
	this.radian = null;
	this.id = null;

	this.addParent = function(parent) {
		if (this.parents == null) {
			this.parents = new Array();
		}
		var isExist = false;
		for ( var i = 0; i < this.parents.length; i++) {
			if (this.parents[i].id == parent.id) {
				isExist = true;
				break;
			}
		}
		if (!isExist) {
			this.parents.push(parent);
			window.org.xiha.html5.core.connectorUtil.bindingConnector(obj,
					parent, '#121011', '#121011', 1);
		}
	};

	this.addChild = function(child) {
		if (this.childs == null) {
			this.childs = new Array();
		}
		var isExist = false;
		for ( var i = 0; i < this.childs.length; i++) {
			if (this.childs[i].id == child.id) {
				isExist = true;
				break;
			}
		}
		if (!isExist) {
			this.childs.push(child);
			window.org.xiha.html5.core.connectorUtil.bindingConnector(obj,
					child, '#121011', '#121011', 1);
		}

	};

	if (window.org.xiha.html5.core.scene.rootNode == null) {
		window.org.xiha.html5.core.scene.setRootNode(this);
	}

	window.org.xiha.html5.core.nodeUtil.addNode(this);
};

org.xiha.html5.core.force = function(f, radian) {
	this.f = f;
	this.radian = radian;
	this.wastage = function() {
		if (f < this.minFZero) {
			f = 0;
		}

	};
};

org.xiha.html5.core.NodeUtil = function(radius) {
	this.countfb = 0;
	this.isfb = true;
	this.nodeIdSequence = 0;
	this.nodesMap = {};
	this.nodes = new Array();
	this.cubeIDNodeID = {};
	// this.matchedNodes = new Array();
	this.connectorUtil = new org.xiha.html5.core.ConnectorUtil();
	this.radius = radius;
	this.kPush = 0.2;
	this.kPull = 0.075;
	this.minLen = 50;
	// 从根开始遍历结点
	this.genPushForce = function(beginPoint, endPoint) {
		var a = endPoint.getY() - beginPoint.getY();
		var b = endPoint.getX() - beginPoint.getX();

		var c = this.abc(a, b);

		var f = this.kPush * (100 / (c.c));
		return new org.xiha.html5.core.force(f, c.r);
	};

	this.genPullForce = function(beginPoint, endPoint) {
		var a = endPoint.getY() - beginPoint.getY();
		var b = endPoint.getX() - beginPoint.getX();

		var r = 0;
		var f = 0;

		var c = this.abc(a, b);

		var subLen = c.c - this.minLen;
		f = Math.abs(this.kPull * subLen);

		if (subLen > 0) {
			r = c.r;
		} else {
			r = c.r + Math.PI;
		}
		return new org.xiha.html5.core.force(f, r);
	};

	this.abc = function(a, b) {
		var r = 0;
		var c = 0;

		if (a > 0 && b < 0) {
			r = Math.atan(a / b) + Math.PI;
			c = a / Math.sin(r);

		} else if (a > 0 && b > 0) {
			r = Math.atan(a / b);
			c = a / Math.sin(r);

		} else if (a == 0 && b < 0) {
			r = Math.PI;
			c = -b;

		} else if (a == 0 && b > 0) {
			r = 0;
			c = b;

		} else if (a < 0 && b < 0) {
			r = -Math.PI + Math.atan(a / b);
			c = a / Math.sin(r);

		} else if (a < 0 && b > 0) {
			r = Math.atan(a / b);
			c = a / Math.sin(r);

		} else if (a > 0 && b == 0) {
			r = Math.PI / 2;
			c = a;

		} else if (a < 0 && b == 0) {
			r = -Math.PI / 2;
			c = -a;

		} else if (a == 0 && b == 0) {
			r = 0;
			c = 0;
		}
		return {
			'c' : c,
			'r' : r
		};
	};
	this.addForce = function(f1, f2) {
		var a = Math.sin(f1.radian) * f1.f + Math.sin(f2.radian) * f2.f;
		var b = Math.cos(f1.radian) * f1.f + Math.cos(f2.radian) * f2.f;
		var c = this.abc(a, b);
		var f = c.c;
		return new org.xiha.html5.core.force(f, c.r);

	};

	this.forceBalance = function() {
		if (this.isfb) {
			this.countfb++;
			for ( var i = 0; i < this.nodes.length; i++) {
				var forceNode = this.nodes[i];
				var fn = new org.xiha.html5.core.force(0, 0);
				var f0 = new org.xiha.html5.core.force(0, 0);
				// console.log('开始计算nodeid:' + forceNode.id + '的受力');
				// 1.计算Node间合力
				if (forceNode.id != 0) {
					for ( var j = 0; j < this.nodes.length; j++) {
						if (forceNode.id != this.nodes[j].id) {
							var tmpf0 = this.genPushForce(
									this.nodes[j].obj.centerPosition,
									forceNode.obj.centerPosition);
							// var c = tmpf.radian / 0.017453293;
							// console.log('受到nodeid:[' + this.nodes[j].id +
							// ']的力,角度'
							// + c + ',大小[' + tmpf.f + ']');
							f0 = this.addForce(tmpf0, f0);
							// var c0 = f0.radian / 0.017453293;
							// console.log('合并后合力为[' + c0 + '],大小为[' + f0.f +
							// ']');
						}
					}
				}
				// console.log(forceNode.id + '受到' + nn + '个推力，合力=');
				// console.log(f0);
				var fpc = new org.xiha.html5.core.force(0, 0);

				// 2.计算父节点拉力或引力合力
				var fp = new org.xiha.html5.core.force(0, 0);
				if (forceNode.parents != null) {
					for ( var m = 0; m < forceNode.parents.length; m++) {
						var tmpfp = this.genPullForce(
								forceNode.obj.centerPosition,
								forceNode.parents[m].centerPosition);
						fp = this.addForce(fp, tmpfp);

					}

				}
				// var c1 = f1.radian / 0.017453293;
				// console.log('拉力f1['+c1+'],大小为['+f1.f+']');
				// 3.计算子节点拉力或引力合力
				var fc = new org.xiha.html5.core.force(0, 0);
				if (forceNode.childs != null) {
					// if (this.countfb < 30) {
					// console
					// .log('字节点应力添加前f=' + f1.f + ',r='
					// + f1.radian);
					// }

					for ( var m = 0; m < forceNode.childs.length; m++) {
						var tmpfc = this.genPullForce(
								forceNode.obj.centerPosition,
								forceNode.childs[m].centerPosition);
						// if (this.countfb < 30) {
						//
						// console.log('tmpf1,f=' + tmpf1.f + ',r='
						// + tmpf1.radian);
						// }
						fc = this.addForce(fc, tmpfc);
					}
					// if (this.countfb < 30) {
					// console.log('子节点合力f=' + fc.f + ',r=' + fc.radian);
					//
					// console.log('合力运算后f=' + f1.f + ',r=' + f1.radian);
					// }
				}
				fpc = this.addForce(fc, fp);
				// console.log(forceNode.id + '受到1个推力，合力=');
				// console.log(f1);

				fn = this.addForce(fpc, f0);

				// console.log(f2);
				// var c0 = f2.radian / 0.017453293;
				// console.log('最终合并合力为[' + c0 + '],大小为[' + f0.f + ']');
				var x = forceNode.obj.centerPosition.getX() + fn.f
						* Math.cos(fn.radian);
				var y = forceNode.obj.centerPosition.getY() + fn.f
						* Math.sin(fn.radian);
				forceNode.obj.centerPosition = new org.xiha.html5.core.NormalPoint(
						x, y);
			}
		}
	};

	this.addNode = function(node) {
		this.nodeIdSequence++;

		if (node.id == null) {
			node.id = this.nodeIdSequence;
			this.nodesMap[this.nodeIdSequence] = node;
			this.nodes.push(node);
			this.cubeIDNodeID[node.obj.id] = node.id;
		} else if (node.id >= 0) {
			if (this.nodesMap[node.id] == null) {
				this.nodesMap[node.id] = node;
				this.nodes.push(node);
			} else {
				console.log("node already exist, node is:");
				console.log(node);
			}
		}

	};

	this.searchNodeByCubeId = function(cubeId) {
		var node = null;
		var nodeId = this.cubeIDNodeID[cubeId];

		node = this.nodesMap[nodeId];

		return node;
	};

	this.combineNode = function(frmNode, toNode, pNodes) {
		// 1.将frmNode的孩子过继给toNode
		if (frmNode.childs != null && frmNode.childs.length != 0) {
			for ( var i = 0; i < frmNode.childs.length; i++) {
				var childObj = frmNode.childs[i];
				if (toNode.childs == null) {
					toNode.childs = new Array();
				}

				var childNode = this.searchNodeByCubeId(childObj.id);
				childNode.addParent(toNode.obj);
				toNode.addChild(childObj);

				window.org.xiha.html5.core.connectorUtil.bindingConnector(
						toNode.obj, childObj, '#121011', '#121011', 1);
			}
		}
		// 2.找到frmNode的父亲，将其从父亲的孩子节点中删除，并toNode设置为其父亲的孩子
		for ( var j = 0; j < pNodes.length; j++) {
			var pNode = pNodes[j];
			var reMoveIdx = -1;
			for ( var i = 0; i < pNode.childs.length; i++) {
				if (pNode.childs[i].id == frmNode.obj.id) {
					reMoveIdx = i;
					break;
				}
			}
			if (reMoveIdx >= 0) {
				pNode.childs.splice(reMoveIdx, 1, toNode.obj);
			}
			// 3.消除连接，并建立新连接
			window.org.xiha.html5.core.connectorUtil
					.destoryConnector(frmNode.obj.id);
			this.newNode(toNode.obj, pNode.obj);
		}
		// new node
		// 4.清除frmNode中包含的cube对象，并最终清除frmNode对象
		delete this.cubeIDNodeID[frmNode.obj.id];
		window.org.xiha.html5.core.scene.removeRenderable(frmNode.obj.id);
		delete frmNode.obj;
		this.removeNode(frmNode);
	};

	// 从树上的子节点删除所有节点，释放内存
	// this.removeAllFromParentTree = function(cNode) {
	// if (cNode.childs != null && cNode.childs.length != 0) {
	// while (cNode.childs != null || cNode.childs.length != 0) {
	// var tmpNode = cNdoe.childs.pop();
	// this.removeAllFromParentTree(tmpNode);
	// this.removeNode(tmpNode);
	// }
	//
	// } else {
	// this.removeNode(cNode);
	// }
	// };

	this.removeNode = function(node) {
		delete this.nodesMap[node.id];
		for ( var i = 0; i < this.nodes.length; i++) {
			if (node.id == this.nodes[i].id) {
				this.nodes.splice(i, 1);
				break;
			}
		}

	};

	this.searchNodeByText = function(text) {

		for ( var i = 0; i < this.nodes.length; i++) {
			if (this.nodes[i].obj.renderableText != null
					&& this.nodes[i].obj.renderableText.text() == text) {
				return this.nodes[i];
			}
		}
		return null;
	};

	this.newNode = function(obj, pObj) {
		var thisNode = null;
		// 检查node是否存在
		if (this.nodes != null && this.nodes.length != 0) {
			for ( var i = 0; i < this.nodes.length; i++) {
				if (this.nodes[i].obj.id == obj.id) {
					thisNode = this.nodes[i];
					break;
				}
			}
		}
		if (thisNode == null) {
			thisNode = new org.xiha.html5.core.Node(obj);
		}
		if (pObj != null) {
			thisNode.addParent(pObj);

			// 检查parent所在node，确保child里面添加入当前node的obj
			var pNodes = null;

			if (this.nodes != null && this.nodes.length != 0) {

				for ( var i = 0; i < this.nodes.length; i++) {
					if (this.nodes[i].obj.id == pObj.id) {
						if (pNodes == null) {
							pNodes = new Array();
						}
						pNodes.push(this.nodes[i]);
					}
				}
			}
			if (pNodes == null) {
				pNodes = new Array();
				pNodes.push(new org.xiha.html5.core.Node(pObj));

			}

			for ( var i = 0; i < pNodes.length; i++) {

				pNodes[i].addChild(obj);
			}

		} else {
			var x = Math.floor(thisNode.obj.scene.getWidth() / 2);
			var y = Math.floor(thisNode.obj.scene.getHeight() / 2);
			var p = new org.xiha.html5.core.NormalPoint(x, y);
			thisNode.obj.centerPosition = p;
			window.org.xiha.html5.core.scene.setRootNode(thisNode);
		}
	};

	window.org.xiha.html5.core.nodeUtil = this;

};