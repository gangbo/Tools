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

package Car::Decorator;
use base qw/Car/;
use Data::Dumper;

sub new {
    my ( $class, $car ) = @_;
    bless { car => $car }, $class;
}

sub start {
    my ($self) = @_;
    $self->{car}->start;
}
1;

#component EngineA
package Car::EngineA;
use base qw/Car::Decorator/;

sub start {
    my ($self) = @_;
    $self->{car}->start;
    print "=engine by A \n";
}

1;

#component EngineB
package Car::EngineB;
use base qw/Car::Decorator/;

sub start {
    my ($self) = @_;
    $self->{car}->start;
    print "=engine by B \n";
}
1;

#component BB
package Car::BB;
use base qw/Car::Decorator/;

sub start {
    my ($self) = @_;
    $self->{car}->start;
    print "= BB \n";
}
1;
my $myCar = Car::EngineB->new( Car::EngineA->new( Car->new ) );
my $carDecorator = Car::Decorator->new($myCar);
$carDecorator->start;

$myCar = Car::BB->new($myCar);
$carDecorator = Car::Decorator->new($myCar);
$carDecorator->start;

=head
装饰者模式,首先新建一个装饰者Decorator,然后就是设计组件Component
装饰者模式的好处就是可以组装组件，上面的例子中我们后面又添加了
一个Car::BB的组件，该组件的的功能是当车启动的时候发出bb的声音
对比继承，装饰更加灵活,比如我们现在需要一个使用A引擎并能发出bb声音
的对象，如果使用面想对象的话就要又写一个class，这样就会出现类爆炸
的局面
=cut

