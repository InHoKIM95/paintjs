<?php
if ( ! defined('BASEPATH')) exit('No direct script access allowed');


function hi(){
    $data = $this->input->get_post('data');

    console.log($data);
}