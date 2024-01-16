use std::io::Write;
use std::string::String;

#[derive(Debug)]
pub struct Communication {
    serial_path: Option<String>,
    serial: Option<Box<dyn serialport::SerialPort>>,
    is_locked: bool,
}

impl Communication {
    pub fn new() -> Self {
        Self {
            serial_path: None,
            serial: None,
            is_locked: false,
        }
    }

    fn lock(&mut self) {
        self.is_locked = true;
    }

    fn unlock(&mut self) {
        self.is_locked = false;
    }

    fn wait_until_unlocked(&self) {
        while self.is_locked {
            //  wait until serial is unlocked
            //  sleep 200ms
            std::thread::sleep(std::time::Duration::from_millis(200));
        }
    }

    pub fn get_serial_path(&self) -> Option<String> {
        match self.serial_path {
            Some(ref path) => Some(path.clone()),
            None => None,
        }
    }

    pub fn set_serial_path(&mut self, serial_path: String) {
        //  wait until serial is unlocked
        self.wait_until_unlocked();

        //  lock serial
        self.lock();

        //  close serial port
        match self.close() {
            Err(message) => {
                println!("{}", message);
            }
            _ => {}
        }

        self.serial_path = Some(serial_path);

        //  unlock serial
        self.unlock();
    }

    fn open(&mut self) -> Result<(), String> {
        //  check if serial path is empty
        if self.serial_path.is_none() {
            return Err("Serial path is empty.".to_string());
        }

        match serialport::new(self.serial_path.clone().unwrap(), 9_600)
            .timeout(std::time::Duration::from_millis(100))
            .open()
        {
            Ok(port) => {
                self.serial = Some(port);
                Ok(())
            }
            Err(e) => {
                Err(format!("Failed to open. Error: {}", e))
            }
        }
    }

    fn close(&mut self) -> Result<(), String> {
        if self.serial.is_some() {
            //  close serial port
            self.serial = None;

            Ok(())
        } else {
            Err("Serial port is not open yet.".to_string())
        }
    }

    pub fn send_command_only(&mut self, command: String) -> Result<(), String> {
        //  wait until serial is unlocked
        self.wait_until_unlocked();

        //  lock serial
        self.lock();

        if self.serial.is_none() {
            match self.open() {
                Err(message) => {
                    //  unlock serial
                    self.unlock();

                    return Err(message);
                }
                _ => {}
            }
        }

        let result = match self.serial.as_mut().unwrap().write(command.as_bytes()) {
            Ok(_) => {
                Ok(())
            }
            Err(_) => {
                Err(format!("Failed to send command. command: {}", command))
            }
        };

        //  unlock serial
        self.unlock();

        result
    }

    pub fn receive_message(&mut self) -> Result<String, String> {
        //  wait until serial is unlocked
        self.wait_until_unlocked();

        //  lock serial
        self.lock();

        if self.serial.is_none() {
            match self.open() {
                Err(message) => {
                    //  unlock serial
                    self.unlock();

                    return Err(message);
                }
                _ => {}
            }
        }

        let mut buffer: Vec<u8> = vec![0; 100];

        //  retry until success or 3 times
        let result = match self.serial.as_mut().unwrap().read(&mut buffer) {
            Ok(_) => {
                Ok(String::from_utf8(buffer).unwrap())
            }
            Err(_) => {
                Err("Unable to read from serial port.".to_string())
            }
        };

        //  unlock serial
        self.unlock();

        result
    }
}