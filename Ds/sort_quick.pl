#!/usr/bin/env perl
use strict;
use warnings;

sub middle {
    my ( $n, @arr ) = @_;
    my $key = shift @arr;
    my ( @left, @right );
    for (@arr) {
        push @left,  $_ if $_ < $key;
        push @right, $_ if $_ > $key;
    }
    my $left_length = @left ? scalar @left : 0;
    if ( $left_length == $n - 1 ) {
        return $key;
    }
    if ( $left_length < $n ) {
        return middle( $n - $left_length - 1, @right );
    }
    middle( $n, @left );
}

my @arr = ( 999, 4, 8, 10, 11, 300, 6, 99, 77, 2 );
print @arr;
print "\n";
print '*******' . &middle( 5, @arr );
print "\n";
print '*******' . &middle( 1, @arr );
print "\n";
print '*******' . &middle( 2, @arr );
print "\n";
print '*******' . &middle( 3, @arr );
print "\n";

=head
找出第n小的数
