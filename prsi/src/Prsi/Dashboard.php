<?php
namespace Prsi;
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class Dashboard implements MessageComponentInterface {
	protected $games = array();
	protected $clients;

	function __construct() {
		$this->clients = new \SplObjectStorage;
	}

	function onOpen(ConnectionInterface $conn) {
		$game = end($this->games);
		if (!$game) {
			echo "New game\n";
			$game = new Game;
			$this->games[] = $game;
		}
		$game->players->attach($conn);
		$game->start();
		$this->clients->attach($conn, $game);
	}
	
	function onMessage(ConnectionInterface $from, $msg) {
		$game = $this->clients[$from];
		$game->play($from, $msg);
	}

	function onClose(ConnectionInterface $conn) {
		$game = $this->clients[$conn];
		$game->players->detach($conn);
		foreach ($game->players as $player) {
			Client::send($player, "A player disconnected.");
		}
		$this->clients->detach($conn);
	}

	function onError(ConnectionInterface $conn, \Exception $e) {
		echo "An error has occurred: $e\n";
		$conn->close();
	}
}
