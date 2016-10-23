<?php
namespace Prsi;
use Ratchet\ConnectionInterface;

class Client {
	static function send(ConnectionInterface $conn, $message, array $data = array()) {
		$data['message'] = date('H:i:s ') . $message;
		$conn->send(json_encode($data));
	}
}
