function OrderedRepeaterWidget() {

    return {
        transclude: 'element',
        priority: 1000,
        terminal: true,
        compile: function(element, attr, linker) {
            return function(scope, iterStartElement, attr){

                var expressions = attr.orderedRepeater.split(" in ");
                if(expressions.length != 2){
                    throw new Error("Expression does not match X in Y pattern")
                } else {
                    var expression = expressions[1];
                    var modelName = expressions[0];
                }


                var anchor = iterStartElement[0];
                var parent = anchor.parentNode;

                var oldCollection = [];

                scope.$watch(expression, function (newCollection){

                    if(newCollection){

                        var oldMaxIndex, oldMinIndex, newMaxIndex, newMinIndex, maxIndex, minIndex;
                        oldMaxIndex = oldMinIndex = newMaxIndex = newMinIndex =  maxIndex = minIndex = -1;

                        // First we identify the range of the new list, so we can remove items from the previous list
                        if(newCollection.length > 0){
                            newMaxIndex = newCollection[newCollection.length-1].index;
                            newMinIndex = newCollection[0].index;
                        }

                        if(newMaxIndex == undefined){
                            throw new Error("Items in list does not have 'index' property");
                        }

                        if(oldCollection.length > 0){
                            oldMaxIndex = oldCollection[oldCollection.length - 1].index;
                            oldMinIndex = oldCollection[0].index;
                        }

                        minIndex = (newMinIndex > oldMinIndex)? oldMinIndex : newMinIndex;
                        maxIndex = (newMaxIndex > oldMaxIndex)? newMaxIndex : oldMaxIndex;

                        var oldCollectionCursor = 0;
                        var newCollectionCursor = 0;

                        var tempCollection = [];

                        for(var index = minIndex; index <= maxIndex; index++){

                            var newItem = newCollection[newCollectionCursor];
                            var oldItem = oldCollection[oldCollectionCursor];

                            if(!oldItem && !newItem){
                                break;
                            } else if(!oldItem || (newItem && newItem.index < oldItem.index)){

                                if(isNaN(newItem.index)){
                                    throw new Error("Item in collection does not have 'index' property", newItem);
                                    break;
                                }

                                // No old item exists, create a new item
                                var newScope = scope.$new();
                                newScope[modelName] = {};
                                for(var key in newItem) newScope[modelName][key] = newItem[key];

                                linker(newScope, function(clone){
                                    var item = {
                                        scope: newScope,
                                        element: clone,
                                        index: newScope[modelName].index
                                    };
                                    var lastItem = tempCollection[tempCollection.length-1];
                                    tempCollection.push(item);
                                    if(lastItem){
                                        lastItem.element[0].insertAdjacentElement("afterend", clone[0]);
                                    } else {
                                        parent.insertAdjacentElement("afterbegin", clone[0]);
                                    }
                                });

                                newCollectionCursor++;

                            } else if(!newItem || (oldItem && newItem.index > oldItem.index)){

                                // There is an older item that needs to be removed
                                oldItem.scope.$destroy();
                                removeElement(oldItem.element);
                                oldCollectionCursor++;

                            }  else if (newItem.index == oldItem.index){

                                // Old item matches new item in the collection, use the old item
                                tempCollection.push(oldItem);
                                oldCollectionCursor++;
                                newCollectionCursor++;

                            }
                        }

                        oldCollection = tempCollection;
                    }
                });

                function removeElement(element){
                    element.remove();
                }
            };
        }
    }

}