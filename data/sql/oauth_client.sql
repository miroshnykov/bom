INSERT INTO oauth_clients (
    client_id,
    client_secret,
    redirect_uri
) VALUES (
    'testclient',
    '$2y$14$f3qml4G2hG6sxM26VMq.geDYbsS089IBtVJ7DlD05BoViS9PFykE2',
    'http://bom.develop'
);

UPDATE oauth_clients
SET
    client_id = 'testclient',
    client_secret = '$2y$14$f3qml4G2hG6sxM26VMq.geDYbsS089IBtVJ7DlD05BoViS9PFykE2',
    redirect_uri = 'http://bom.develop'
WHERE true;
