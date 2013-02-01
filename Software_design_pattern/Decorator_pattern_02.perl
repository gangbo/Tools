#!/usr/bin/evn perl
use strict;
use warnings;

package Car;

sub new() {
    my ($class) = @_;
    bless {}, $class;
}

sub start {
    print "start\n";
}
1;

#component EngineA
package Car::EngineA;
use base qw/Car/;

sub new {
    my ($class,$car) = @_;
    bless { decorated_car => $car}, $class;
}

sub start {
    my ($self) = @_;
    $self->{decorated_car}->start;
    print "=engine by A \n";
}

1;

#component EngineB
package Car::EngineB;
use base qw/Car/;

sub new {
    my ($class,$car) = @_;
    bless { decorated_car => $car}, $class;
}

sub start {
    my ($self) = @_;
    $self->{decorated_car}->start;
    print "=engine by B \n";
}
1;

#component BB
package Car::BB;
use base qw/Car/;

sub new {
    my ($class,$car) = @_;
    bless { decorated_car => $car}, $class;
}

sub start {
    my ($self) = @_;
    $self->{decorated_car}->start;
    print "= BB \n";
}
1;
my $myCar = Car->new;
my $carWithEngineA = Car::EngineA->new($myCar);
$carWithEngineA->start;

my $carWithEngineAB = Car::EngineB->new($carWithEngineA);
$carWithEngineAB->start;


=head
装饰者模式
和Decorator_pattern_01的代码稍有不同，原理一样，省略了一个装饰器的公共类
不过需要在每个子类多了个new方法
=cut

