import smtplib
import os
import json

from email.message import EmailMessage


def notify(message):
    try:
        message = json.loads(message)
        mp3_fid = message.get("mp3_fid")
        sender_address = os.environ.get("EMAIL_USER")
        sender_pass = os.environ.get("EMAIL_PASS")
        recipient_address = message.get("username")

        # Creating message
        msg = EmailMessage()
        msg.set_content(
            f"Your MP3 file is ready for download.\nMP3 file_id: {mp3_fid}")
        msg["Subject"] = "MP3 Conversion Complete"
        msg["From"] = sender_address
        msg["To"] = recipient_address

        session = smtplib.SMTP("smtp.gmail.com", 587)
        session.starttls()
        session.login(sender_address, sender_pass)
        session.send_message(msg, sender_address, recipient_address)
        session.quit()
        print("Email sent successfully")

    except Exception as e:
        print(e)
        return e
