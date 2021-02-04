FROM nikolaik/python-nodejs:python3.6-nodejs10

# RUN wget -q https://www.postgresql.org/media/keys/ACCC4CF8.asc -O- | sudo apt-key add -

RUN apt-get update && apt-get install git

RUN adduser --system --home=/opt/openhrms --group openhrms \
  && mkdir /var/log/openhrms

RUN git clone --progress --verbose https://github.com/odoo/odoo.git --depth 1 --branch 11.0 --single-branch /opt/openhrms

RUN git clone --progress --verbose https://github.com/CybroOdoo/OpenHRMS.git --depth 1 --branch 11.0 --single-branch /opt/openhrms/openhrms


RUN apt-get install -y python3-dev build-essential libxml2-dev libxslt-dev libevent-dev g++ gcc 
RUN apt-get install -y python3-lxml python-dev \
    libsasl2-dev python-dev libldap2-dev libssl-dev

RUN pip3 install --upgrade pip


RUN pip3 install -r /opt/openhrms/doc/requirements.txt
RUN pip3 install -r /opt/openhrms/requirements.txt
RUN pip3 install pandas
# RUN pip install odoo12-addon-web-responsive
# RUN apt-get install -y curl
# RUN curl -sL https://deb.nodesource.com/setup_6.x | bash

RUN npm install -g less@3.0.4 less-plugin-clean-css

RUN cd /tmp \
  && wget https://github.com/wkhtmltopdf/wkhtmltopdf/releases/download/0.12.4/wkhtmltox-0.12.4_linux-generic-amd64.tar.xz \
  && tar -xvf wkhtmltox-0.12.4_linux-generic-amd64.tar.xz \
  && mv wkhtmltox/bin/wk* /usr/bin/ \
  && chmod a+x /usr/bin/wk*



COPY ./config/openhrms-server.service /lib/systemd/system/

RUN chmod 755 /lib/systemd/system/openhrms-server.service \
  && chown root: /lib/systemd/system/openhrms-server.service

RUN chown -R openhrms: /opt/openhrms/

RUN chown openhrms:root /var/log/openhrms

RUN cp /opt/openhrms/debian/odoo.conf /etc/openhrms-server.conf
RUN chown openhrms: /etc/openhrms-server.conf \
  && chmod 640 /etc/openhrms-server.conf



# RUN systemctl enable openhrms-server

# ENTRYPOINT ["systemctl", "start", "openhrms-server"]
ENTRYPOINT [ "/opt/openhrms/odoo-bin", "-c", "/etc/openhrms-server.conf" ]