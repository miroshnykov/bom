<?php
/*
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * This software consists of voluntary contributions made by many individuals
 * and is licensed under the MIT license.
 */

$appId  = '131231';
$key    = '55cfac81f4e955f6c7e4';
$secret = '4d958edcbe0ae4f2c47e';

if(preg_match(
	"/https?\:\/\/(.+)\:(.+)@api\.pusherapp\.com\/apps\/(.+)/",
	getenv('PUSHER_URL'),
	$output)) {

	$key    = $output[1];
	$secret = $output[2];
	$appId  = $output[3];
}

return array(
    'zfr_pusher' => array(
        /**
         * Specify your Pusher credentials. You can find them in your dashboard on Pusher's website
         */
        'app_id' => $appId,
        'key'    => $key,
        'secret' => $secret
    )
);
