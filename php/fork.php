<?php
class ForkAdmin {
    private $progress;
    const FORK_SIZE = 5;
    
    public function __construct(){
        $this->progress = 0;
    }
    
    public function fork(){
        $i = 0; 
        $pid_arr = array();
        while($i<self::FORK_SIZE){
            $pid = pcntl_fork();
            if ($pid == -1){
                die('could not fork');
            }
            if($pid){
                $pid_arr[$i] = $pid;
            }else{
                echo "fork $i \n";
                $this->beginTask($i);
            }
            $i++;
        }
        echo "\rrunning... ";
        $j = 0;
        while(count($pid_arr) > 0){
            $myId = pcntl_waitpid(-1, $status, WNOHANG);
            foreach($pid_arr as $key => $pid){
                if($myId == $pid){
                    unset($pid_arr[$key]);
                }
            }
            usleep(100000);
            echo "\rrunning... ".$j++;
         }
         echo " progress = ".$this->progress;
         echo "\n";
    }

    public function beginTask(){
        $this->progress++;
        echo " task =".$this->progress."\n";
        sleep(1);
        exit; 
    }
}

$forkAdmin = new ForkAdmin();
$forkAdmin->fork();
