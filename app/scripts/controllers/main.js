'use strict';

angular.module('orderedRepeaterApp')
  .controller('MainCtrl', function ($scope) {

        var count = 3;

        $scope.awesomeThings = [
            { index:1, data: "1" },
            { index:2, data: "2" },
            { index:3, data: "3" }
        ];


        $scope.add = function(){

            var result = [];
            for(var i=0; i<$scope.awesomeThings.length; i++){
                var item = $scope.awesomeThings[i];
                result.push({
                    index: item.index,
                    data: item.data
                })
            }

            $scope.awesomeThings = result;

            count++;
            $scope.awesomeThings.push({
                index: count,
                data: Math.random()
            });
        }

        $scope.remove = function(){

            var result = [];
            for(var i=1; i<$scope.awesomeThings.length; i++){
                var item = $scope.awesomeThings[i];
                result.push({
                    index: item.index,
                    data: item.data
                })
            }

            $scope.awesomeThings = result;
        }

  });
