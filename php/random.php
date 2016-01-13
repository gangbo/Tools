<?php

$arr = [
    [
        'id' => 1,
        'prob' => 50,
    ],
    [
        'id' => 2,
        'prob' => 20,
    ],
    [
        'id' => 3,
        'prob' => 30,
    ],
];

$left = 1;
foreach ($arr as &$row) {
    $row['left'] = $left;
    $row['right'] = $left + $row['prob'] - 1;
    $left = $row['right'] + 1;
}



function randByPeriod($array , $random) {
    foreach ($array as $v) {
        if ($v['left'] <= $random && $random <= $v['right']) {
            echo "random = $random, 中: id=" . $v['id'] . "\n";
            continue;
        }
    }
}

$i = 1000;
while($i--) {
    randByPeriod($arr, rand(1,100));
}
