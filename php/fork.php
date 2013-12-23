<?php
/**
* Class and Function List:
* Function list:
* - actionIndex()
* - beginRun()
* - getKeyWordIDs()
* - curl()
* - appendLog()
* - removeOldLogFiles()
* - __destruct()
* Classes list:
* - CronCommand extends CConsoleCommand
*/
class CronCommand extends CConsoleCommand {
    private $filehandle;
    const LOG_FILE = 'runtime/keyword.log';
    const PAST_DAYS = 7;
    const PAGE_SIZE = 1000;
    const FORK_SIZE = 10;
    public function actionIndex() {
        $i = 0;
        $pid_arr = array();
        while ($i < self::FORK_SIZE) {
            $pid = pcntl_fork();
            if ($pid == - 1) {
                die('could not fork');
            } else {
                if ($pid) {
                    $pid_arr[$i] = $pid;
                } else {
                    echo "fork $i \n";
                    $this->beginRun($i);
                }
            }
            $i++;
        }
        echo "\rrunning... ";
        $j = 0;
        while (count($pid_arr) > 0) {
            $myId = pcntl_waitpid(-1, $status, WNOHANG);
            foreach ($pid_arr as $key => $pid) {
                if ($myId == $pid) {
                    unset($pid_arr[$key]);
                }
            }
            usleep(100000);
            echo "\rrunning... " . $j++;
        }
    }
    public function beginRun($i) {
        $this->removeOldLogFiles();
        $page = 0;
        while ($ids = $this->getKeyWordIDs($page++, $i)) {
            foreach ($ids as $id) {
                $url = Yii::app()->params['domain'] . '/keyword/' . $id . '.html';
                $httpCode = $this->curl($url);
                try {
                    $this->appendLog("$id\t$httpCode\n");
                }
                catch(Exception $e) {
                    echo 'Message : ' . $e->getMessage() . "\n";
                    die;
                }
            }
        }
        echo "ok $i use memory :" . memory_get_usage() . "\n";
        exit;
    }
    private function getKeyWordIDs($page, $i) {
        $pageSize = self::PAGE_SIZE;
        Yii::app()->db->setActive(false);
        Yii::app()->db->setActive(true);
        $results = Yii::app()->db->createCommand()->select('id')->from('keywords')->where('mod(id,' . self::FORK_SIZE . ')=' . $i)->limit($pageSize, $page * $pageSize)->queryColumn();
        if (count($results) > 0) return $results;
        return false;
    }
    private function curl($url) {
        $handle = curl_init($url);
        curl_setopt($handle, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($handle, CURLOPT_NOBODY, TRUE); // remove body

        $response = curl_exec($handle);
        $httpCode = curl_getinfo($handle, CURLINFO_HTTP_CODE);
        curl_close($handle);
        return $httpCode;
    }
    private function appendLog($str) {
        $filename = dirname(__FILE__) . '/../' . self::LOG_FILE . date('ymd');
        if (is_null($this->filehandle)) {
            $this->filehandle = fopen($filename, 'a');
        }
        if (!$this->filehandle) {
            throw new Exception("不能打开文件 $filename");
        }
        if (fwrite($this->filehandle, $str) === FALSE) {
            throw new Exception("不能写入到文件 $filename");
        }
    }
    private function removeOldLogFiles() {
        $filename = dirname(__FILE__) . '/../' . self::LOG_FILE . date('ymd', time() - 3600 * 24 * self::PAST_DAYS);
        if (!file_exists($filename)) {
            return;
        }
        unlink($filename);
    }
    public function __destruct() {
        if ($this->filehandle) {
            fclose($this->filehandle);
        }
    }
}
