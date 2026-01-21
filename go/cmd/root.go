package cmd

import (
	"fmt"
	"os"

	"github.com/reidlai/ta-workspace/modules/portfolio/go/internal/server"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

var (
	cfgFile string
	config  server.Config
)

var rootCmd = &cobra.Command{
	Use:   "portfolio-server",
	Short: "Standalone server for portfolio-go",
	RunE: func(cmd *cobra.Command, args []string) error {
		return server.Run(&config)
	},
}

func Execute() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}

func init() {
	cobra.OnInitialize(initConfig)

	rootCmd.PersistentFlags().StringVar(&cfgFile, "config", "", "config file (default is $HOME/.portfolio-server.yaml)")

	rootCmd.PersistentFlags().StringVar(&config.Host, "host", "localhost", "Server host")
	rootCmd.PersistentFlags().StringVar(&config.Port, "port", "8000", "Server port")
	rootCmd.PersistentFlags().StringVar(&config.LogLevel, "log-level", "INFO", "Log level")
	rootCmd.PersistentFlags().BoolVar(&config.Debug, "debug", false, "Debug mode")

	if err := viper.BindPFlag("host", rootCmd.PersistentFlags().Lookup("host")); err != nil {
		fmt.Println("Error binding host flag:", err)
		os.Exit(1)
	}
	if err := viper.BindPFlag("port", rootCmd.PersistentFlags().Lookup("port")); err != nil {
		fmt.Println("Error binding port flag:", err)
		os.Exit(1)
	}
	if err := viper.BindPFlag("log-level", rootCmd.PersistentFlags().Lookup("log-level")); err != nil {
		fmt.Println("Error binding log-level flag:", err)
		os.Exit(1)
	}
	if err := viper.BindPFlag("debug", rootCmd.PersistentFlags().Lookup("debug")); err != nil {
		fmt.Println("Error binding debug flag:", err)
		os.Exit(1)
	}
}

func initConfig() {
	if cfgFile != "" {
		viper.SetConfigFile(cfgFile)
	} else {
		home, err := os.UserHomeDir()
		if err != nil {
			fmt.Println(err)
			os.Exit(1)
		}

		viper.AddConfigPath(home)
		viper.SetConfigName(".portfolio-server")
	}

	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err == nil {
		fmt.Println("Using config file:", viper.ConfigFileUsed())
	}

	if err := viper.Unmarshal(&config); err != nil {
		fmt.Printf("unable to decode into struct, %v", err)
	}
}
