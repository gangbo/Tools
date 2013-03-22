#!/usr/bin/env perl
use strict;
use warnings;
use Test::More;
use Benchmark qw/cmpthese/;
use Data::Dumper;

#generate some number
my @rand_arr = map { int( rand(500) ) } ( 1 .. 500 );

#my @rand_arr = ( 3, 10, 6, 7, 4, 3, 2, 9, 8, 5, 1, 4, 12 );

#@rand_arr = (1..100);
$, = ',';

sub normal_sort {
    my @arr = @_;
    for my $i (@arr) {
        for my $j (@arr) {
            if ( $i < $j ) {
                $i = $i + $j;
                $j = $i - $j;
                $i = $i - $j;
            }
        }
    }
    return \@arr;
}

sub bubble_sort {
    my @arr  = @_;
    my $flag = 0;
    for my $i ( 0 .. @arr - 1 ) {
        $flag = 1;
        for my $j ( 0 .. @arr - $i - 2 ) {
            if ( $arr[$j] > $arr[ $j + 1 ] ) {
                $arr[ $j + 1 ] = $arr[ $j + 1 ] + $arr[$j];
                $arr[$j]       = $arr[ $j + 1 ] - $arr[$j];
                $arr[ $j + 1 ] = $arr[ $j + 1 ] - $arr[$j];
                $flag          = 0;
            }
        }
    }
    return \@arr;
}
print "start->",@rand_arr,"\n";
sub quick_sort {
    return () unless @_;
    my ( @left, @middle, @right );
    my $key = shift @_;
    push @middle,$key;
    for (@_) {
        if ( $_ < $key ) {
            push @left, $_;
        }
        elsif ( $_ > $key ) {
            push @right, $_;
        }
        else {
            push @middle, $_;
        }
    }
    ( quick_sort(@left), @middle, quick_sort(@right) );
}


my $sorted_arr = &normal_sort(@rand_arr);
is_deeply( &bubble_sort(@rand_arr), $sorted_arr );
is_deeply( [ &quick_sort(@rand_arr) ], $sorted_arr );


cmpthese(
    100,
    {   'normal_sort' => sub { &normal_sort(@rand_arr) },
        'bubble_sort' => sub { &bubble_sort(@rand_arr) },
        'quick_sort'  => sub { [ &quick_sort(@rand_arr) ] },
    }
);

=head
normal_sort 比bubble_sort 循环的次数要多，但测试结果显示速度反而快，
估计是因为buttle_sort中的操作比较耗时，如果都用c语言的话。。。没试

