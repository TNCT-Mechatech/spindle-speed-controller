// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::api::private::OnceCell;
use serde::{Serialize, Deserialize};
use std::fs;
use std::fs::File;
use std::io::prelude::*;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

/// Serial communication section

//  serial path
static SERIAL_PATH: OnceCell<String> = OnceCell::new();

/**
 *  Get available serial ports
 *  Returns a vector of available serial ports
 */
#[tauri::command]
fn get_available_ports() -> Result<Vec<String>, String> {
    let ports = serialport::available_ports();
    //  error handling
    if ports.is_err() {
        return Err("Unable to get available serial ports.".to_string());
    }

    let mut port_path: Vec<String> = Vec::new();

    for port in ports.unwrap() {
        let usb_info = match port.port_type {
            serialport::SerialPortType::UsbPort(usb_info) => Some(usb_info),
            _ => None,
        };

        if let Some(info) = usb_info {
            //  STMicroelectronics Vendor ID is 0x0483
            //  Check if port is produced by STMicroelectronics
            //  https://devicehunt.com/view/type/usb/vendor/0483#search-results-table
            if info.vid == 0x0483 {
                port_path.push(port.port_name);
            }
        }
    }

    Ok(port_path)
}

/**
 *  Get selected serial port
 *  Returns the selected serial port
 */
#[tauri::command]
fn get_selected_port() -> Result<String, ()> {
    match SERIAL_PATH.get() {
        Some(path) => Ok(path.to_string()),
        None => Err(()),
    }
}

/**
 *  Set serial port
 *  Sets the selected serial port
 */
#[tauri::command]
fn set_port(path: String) -> Result<(), String> {
    let ports = serialport::available_ports();
    //  error handling
    if ports.is_err() {
        return Err("Unable to get available serial ports.".to_string());
    }

    //  check if specified port is available
    let mut port_available = false;
    for port in ports.unwrap() {
        if port.port_name == path {
            port_available = true;
            break;
        }
    }

    //  error handling
    if !port_available {
        return Err("Specified port is not available.".to_string());
    }

    //  set serial path
    SERIAL_PATH.set(path).unwrap();

    Ok(())
}

/// Configuration section

#[derive(Serialize, Deserialize, Debug, Clone)]
#[allow(non_snake_case)]
struct Configuration {
    MaxSpindleSpeed: u32,
}

static DEFAULT_CONFIGURATION: Configuration = Configuration {
    MaxSpindleSpeed: 1000,
};

/**
 *  Get max spindle speed
 *  Returns the max spindle speed
 */
#[tauri::command]
fn get_max_spindle_speed(app: tauri::AppHandle) -> Result<u32, String> {
    let config_dir = app.path_resolver().app_config_dir().unwrap();
    let config_path = config_dir.join("config.json");

    let input_fn = fs::read_to_string(&config_path);

    //  file not found
    if input_fn.is_err() {
        return Err("Unable to open existed configuration file.".to_string());
    }

    //  read from configuration
    let deserialized: Configuration = serde_json::from_str(&input_fn.unwrap()).unwrap();
    Ok(deserialized.MaxSpindleSpeed)
}

/**
 *  Set max spindle speed
 *  Sets the max spindle speed
 */
#[tauri::command]
fn set_max_spindle_speed(app: tauri::AppHandle, speed: u32) -> Result<(), String> {
    let config_dir = app.path_resolver().app_config_dir().unwrap();
    let config_path = config_dir.join("config.json");

    let input_fn = fs::read_to_string(&config_path);

    //  file not found
    if input_fn.is_err() {
        return Err("Unable to open existed configuration file.".to_string());
    }

    //  read from configuration
    let mut deserialized: Configuration = serde_json::from_str(&input_fn.unwrap()).unwrap();
    deserialized.MaxSpindleSpeed = speed;

    //  write to configuration
    let serialized = serde_json::to_string(&deserialized).unwrap();
    let mut file = match File::create(&config_path) {
        Ok(file) => file,
        Err(_) => return Err("Unable to open existed configuration file.".to_string()),
    };

    match file.write_all(serialized.as_bytes()) {
        Ok(_) => Ok(()),
        Err(_) => Err("Unable to write to configuration file.".to_string()),
    }
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let config_dir = app.path_resolver().app_config_dir().unwrap();
            //  configuration file path
            let config_path = config_dir.join("config.json");

            //  create configuration directory if not exists
            if !config_dir.exists() {
                fs::create_dir_all(&config_dir).unwrap();
            }

            //  create configuration file if not exists
            if !config_path.exists() {
                let mut file = File::create(&config_path).unwrap();
                let serialized: String = serde_json::to_string(&DEFAULT_CONFIGURATION).unwrap();
                file.write_all(serialized.as_bytes()).unwrap();
            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
