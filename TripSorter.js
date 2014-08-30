﻿/* Документация по формату входных данных.
 
Входные данные предоставляются в виде списка строк, каждая из которых является строкой объекта, сериализованного
в формате JSON:

'{"from":"место отправления","to":"место прибытия","type":"тип транспорта",...}'

Объект в виде JSON-строки содержит информацию о месте отправления, месте прибытия, виде транспорта 
(через свойство объекта "type") и характерные для этого вида транспорта сведения.

Пример: для поезда из Мадрида в Барселону имеем следующую строку:
'{"from":"Madrid","to":"Barcelona","type":"train","No":"78A","Seat":"45B"}'
*/

// ВХОДНЫЕ ДАННЫЕ (массив строк):
var input = ['{"from":"Stockholm","to":"New York JFK","type":"flight","No":"SK22","Gate":"22","Seat":"7B","description":"Baggage will be automatically transferred from your last leg"}',
            '{"from":"Gerona Airport","to":"Stockholm","type":"flight","No":"SK455","Gate":"45B","Seat":"3A","description":"Baggage drop at ticket counter 344"}',
            '{"from":"New York JFK","to":"Washington","type":"taxi","description":"Any taxi"}',
            '{"from":"Barcelona","to":"Gerona Airport","type":"airport bus","description":"No seat assignment"}',
            '{"from":"Madrid","to":"Barcelona","type":"train","No":"78A","Seat":"45B"}'];

// Сортировщик списка карточек:
var tripSorter = {
    cards: undefined, // Список карточек
    setDataToSort : function (input) {
        // Инициализация списка карточек:
        cards = new Array(input.length);
        for (var i = 0; i < cards.length; i++) {
            cards[i] = JSON.parse(input[i]);
        }
    },
    // АЛГОРИТМ СОРТИРОВКИ
    sort : function () {
        // В данном алгоритме предполагается отсутствие петель в маршруте и корректность входных данных.
        // Этап 1. Нахождение начального пункта маршрута.
        // Нужно просмотреть список карточек и найти карточку с таким значением свойства from, которое не совпадает 
        // ни с одним значением свойства to ни для одной карточки.
        for (var i = 0, j = 0; i < cards.length; i++) {
            for (j = 0; j < cards.length; j++) {
                if (i != j && cards[i].from == cards[j].to) {
                    break;
                }
            }
            if (j == cards.length) { // Это значит, что i-тая карточка соответствует началу маршрута. Ее нужно поменять с первой.
                var t = cards[i]; cards[i] = cards[0]; cards[0] = t;
                break;
            }
        }
        // Этап 2. Нахождение последовательности остальных участков маршрута
        // Сначала берем значение cards[0].to и ищем его среди cards[1].from ... cards[n-1].from
        // Пусть k - индекс найденного совпадения, тогда меняем 1-й (считаем с нуля) и k-й элементы cards.
        // Проделываем то же для cards[1].to, cards[2].to и т. д. до конца.
        for (var i = 0, j = 0; i < cards.length - 1; i++) {
            for (j = i + 1; j < cards.length; j++) {
                if (cards[i].to == cards[j].from) {
                    break;
                }
            }
            var t = cards[i + 1]; cards[i + 1] = cards[j]; cards[j] = t;
        }
        // Конец алгоритма. Сложность алгоритма - O(n^2)
    },
    // Последнее, что нужно реализовать - возврат словесного описания маршрута (формат выходных данных).
	// Выходные данные выглядят как предложения естественного языка, специфичные для конкретных видов транспорта.
    /*
    •	Take train 78A from Madrid to Barcelona. Seat 45B.
    •	Take the airport bus from Barcelona to Gerona Airport. No seat assignment.
    •	From Gerona Airport, take flight SK455 to Stockholm. Gate 45B. Seat 3A. Baggage drop at ticket counter 344.
    •	From Stockholm, take flight SK22 to New York JFK. Gate 22. Seat 7B. Baggage will be automatically transferred from your last leg.
    */
    getResult : function () {
        var result = "";
        for (var i = 0; i < cards.length; i++) {
            with (cards[i]) {
                if (type == "train") {
                    result += "Take train " + No + " from " + from + " to " + to + ". Seat " + Seat + ".\n";
                } else if (type == "airport bus") {
                    result += "Take the airport bus from " + from + " to " + to + ". " + description + ".\n";
                } else if (type == "flight") {
                    result += "From " + from + ", take flight " + No + " to " + to + ". Gate " + Gate + ". Seat " + Seat + ". " + description + ".\n";
                } else {
                    for (prop in cards[i]) {
                        result += prop + ": " + cards[i][prop] + ". ";
                    }
                    result += "\n";
                }
            }
        }
        return result;
    }
};

// Работа с данным API:
tripSorter.setDataToSort(input);
tripSorter.sort();
console.log(tripSorter.getResult());