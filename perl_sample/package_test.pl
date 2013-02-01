#!/usr/bin/evn perl
use strict;
use warnings;

package PkgA;
use Data::Dumper;
sub new {
    my($class) = @_;
    bless { varA => "it is PkgA \n" },$class;
}
sub getA {
    my ($self) = @_;
    return $self->{varA};
}
1;

package PkgB;
use base qw/PkgA/;

sub new {
    my($class) = @_;
    my $self = $class->SUPER::new;
    $self->{varB} = "bb";
    return $self;
}

sub describe {
    my ($self) = @_;
}
1;

use Data::Dumper;
my $pkgB = PkgB->new;
print $pkgB->{varA};
